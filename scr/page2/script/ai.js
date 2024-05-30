/*
include these dependencies before importing:
<script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="https://cdn.bootcdn.net/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
*/

/*
function queryAI(string data, DOMElement dom,
            function(DOMElement) clearFunc, function(DOMElement, string) updateFunc,
            function(DOMElement) finalizeFunc) {
    __query(data);
    clearFunc(dom);
    __wait();
    while(__response_text) {
        updateFunc(dom, __response_text);
    }
    finalizeFunc(dom);
}
*/

var socket;
let messageHistory = {
    text: [ //用来存储当前聊天记录
        {"role":"system", "content":"你是一个地道的广东人，精通粤语知识和粤文化，你热情好客，愿意为任何对粤文化感兴趣的人提供帮助，现在有一位用户，他在学习粤语的过程中可能遇到了一些问题，请你尽力帮助他。在你回答完以后，再用标准普通话解释一遍答案"}
    ],
    length: 0
};

function queryAI(data, dom, clearFunc, updateFunc, finalizeFunc) {
    if (data == "") return;
    clearFunc(dom);
    OpenWebsocket(data, dom, updateFunc, finalizeFunc);
}

//开启websocket


function OpenWebsocket(message, dom, updateFunc, finalizeFunc) {
    var host = "spark-api.xf-yun.com";
    var path = "/v3.5/chat";
    var api_secret = "MGMyYjZhMDNlMWM3NzU5NDdiMTU4NGVj";
    var api_key = "14b3d35f7c8a30b5a0dc3b4fcd3e506c";

    var thisMessage = "";

    var url = assembleRequestUrl(host, path, api_key, api_secret);

    if ('WebSocket' in window) { socket = new WebSocket(url); }
    else if ('MozWebSocket' in window) { socket = new MozWebSocket(url); }
    else { alert('浏览器不支持WebSocket'); return; }
    socket.onopen = function () { webSocketSend(message); };
    // 接收到消息时触发的事件处理函数
    socket.onmessage = function (event) {
        //解析收到的消息
        //这里的数据是流式的，不是整体返回，所以需要自己拼接
        var json = $.parseJSON(event.data);
        var code = json.header.code;
        if (code == 0) {
            var status = json.payload.choices.status;
            var content = json.payload.choices.text[0].content;

            thisMessage += content;

            updateFunc(dom, content);
            
            if (status != 2) {
                console.log("received (stat != 2)", json);
            } else {
                console.log("received (stat == 2)", json);
                finalizeFunc(dom);
                messageHistory.text.push({
                    "role": "assisstant",
                    "content": thisMessage
                });
            }
        } else {
            console.log("received (code != 0)", json);
        }
        // 处理接收到的消息
    };
    socket.onclose = function () { console.log("socket.onclose()"); }; // 连接关闭
    socket.onerror = function () { console.log("socket.onerror()"); }; // 发生了错误
    window.unload = function () { socket.close(); }; // 窗口关闭时，关闭连接

}




//这里是生成专属url

function assembleRequestUrl(host, path, apiKey, apiSecret) {
    var url = "wss://" + host + path;
    var date = new Date().toGMTString();
    var algorithm = 'hmac-sha256';
    var headers = 'host date request-line';
    var signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${path} HTTP/1.1`;
    console.log(signatureOrigin, apiSecret);
    var signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret);
    var signature = CryptoJS.enc.Base64.stringify(signatureSha);
    var authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
    var authorization = btoa(authorizationOrigin);
    url = `${url}?authorization=${authorization}&date=${date}&host=${host}`;
    return url;
}

function hmacSha256(apiSecretIsKey, buider) {
    var keyBytes = CryptoJS.enc.Utf8.parse(apiSecretIsKey);
    var messageBytes = CryptoJS.enc.Utf8.parse(buider);
    var hmac = CryptoJS.HmacSHA256(messageBytes, keyBytes);
    var signature = CryptoJS.enc.Base64.stringify(hmac);
    return signature;
}



//发送内容
function webSocketSend(message) {
    var appid = "c7cad7fe";
    var user_token_id = "Minst";
    var params = {
        "header": {
            "app_id": appid,
            "uid": user_token_id
        },
        "parameter": {
            "chat": {
                "domain": "generalv3.5",
                "temperature": 0.5, /*用于决定结果随机性*/
                "max_tokens": 8192,
                "chat_id": user_token_id
            }
        },
        "payload": {
            "message": {
                "text": []
            }
        }
    }
    messageHistory.text.push({ "role": "user", "content": message });
    messageHistory.length += message.length;
    while (messageHistory.length > 8192) { //保证上传的上下文不超过8192
        messageHistory.length -= messageHistory.text.shift().messageHistory.length;
    }
    params.payload.message.text = messageHistory.text;
    socket.send(JSON.stringify(params));
}


