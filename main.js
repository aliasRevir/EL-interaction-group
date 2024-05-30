import * as base64 from 'base-64'
import CryptoJs from 'crypto-js'

let questionInput = document.querySelector("#question");
let sendMsgBtn = document.querySelector("#btn");
let result = document.querySelector("#result");

let output = "";

let requestObj = {
    APPID: 'c7cad7fe',
    APISecret: 'MGMyYjZhMDNlMWM3NzU5NDdiMTU4NGVj',
    APIKey: '14b3d35f7c8a30b5a0dc3b4fcd3e506c',
    Uid: "Minst",
    sparkResult: ''
}

let content = { //我自己新建的一个变量，用来存储当前聊天记录
    text: [{"role":"system", "content":"你是一个地道的广东人，精通粤语知识和粤文化，你热情好客，愿意为任何对粤文化感兴趣的人提供帮助，现在有一位用户，\
    他在学习粤语的过程中可能遇到了一些问题，请你尽力帮助他。在你回答完以后，再用标准普通话解释一遍答案"}],
    length,
}

let params = {
    "header": {
        "app_id": requestObj.APPID,
        "uid": requestObj.Uid
    },
    "parameter": {
        "chat": {
            // "domain": "general",
            "domain": "generalv3.5",
            "temperature": 0.5,
            "max_tokens": 1024,
        }
    },
    "payload": {
        "message": {
            // 如果想获取结合上下文的回答，需要开发者每次将历史问答信息一起传给服务端，如下示例
            // 注意：text里面的所有content内容加一起的tokens需要控制在8192以内，开发者如有较长对话需求，需要适当裁剪历史信息
            "text": []
        }
    }
};

// 点击发送信息按钮
sendMsgBtn.addEventListener('click', (e) => {
    sendMsg()
})
// 输入完信息点击enter发送信息
questionInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') { sendMsg(); }
});
// 发送消息
const sendMsg = async () => {
    //清空回复
    requestObj.sparkResult = "";
    // 获取请求地址
    let myUrl = await getWebsocketUrl();
    // 获取输入框中的内容
    let inputVal = questionInput.value;
    // 每次发送问题 都是一个新的websocketqingqiu
    let socket = new WebSocket(myUrl);

    // 监听websocket的各阶段事件 并做相应处理
    socket.addEventListener('open', (event) => {
        console.log('开启连接！！', event);
        // 发送消息

        content.text.push({ "role": "user", "content": inputVal });
        content.length += inputVal.length;
        while (content.length > 8192) { //保证上传的上下文不超过8192
            content.length -= content.text.shift().content.length;
        }
        params.payload.message.text = content.text;
        console.log("发送消息");
        // 清空输入框
        questionInput.value = ''
        socket.send(JSON.stringify(params))
        output += "用户：" + inputVal + "&#10;";
    })
    socket.addEventListener('message', (event) => {
        let data = JSON.parse(event.data)
        // console.log('收到消息！！',data);
        requestObj.sparkResult += data.payload.choices.text[0].content
        if (data.header.code !== 0) {
            console.log("出错了", data.header.code, ":", data.header.message);
            // 出错了"手动关闭连接"
            socket.close()
        }
        if (data.header.code == 0) {
            // 对话已经完成
            if (data.payload.choices.text && data.header.status === 2) {
                // requestObj.sparkResult += data.payload.choices.text[0].content; 万恶之源
                setTimeout(() => {
                    // "对话完成，手动关闭连接"
                    socket.close()
                }, 1000)
            }
        }
        addMsgToTextarea(output + "靓仔：" + requestObj.sparkResult);
    })
    socket.addEventListener('close', (event) => {
        console.log('连接关闭！！', event);
        // 对话完成后socket会关闭，将聊天记录换行处理
        content.text.push({ "role": "assistant", "content": requestObj.sparkResult });
        content.length += requestObj.sparkResult.length;
        while (content.length > 8192) {
            content.length -= content.text.shift().content.length;
        }
        output += "靓仔：" + requestObj.sparkResult + "&#10;" + "&#10;";
        addMsgToTextarea(output);
    })
    socket.addEventListener('error', (event) => {
        console.log('连接发送错误！！', event);
    })
}
// 鉴权url地址
const getWebsocketUrl = () => {
    return new Promise((resovle, reject) => {
        // let url = "wss://spark-api.xf-yun.com/v1.1/chat";
        let url = "wss://spark-api.xf-yun.com/v3.5/chat";
        let host = "spark-api.xf-yun.com";
        let apiKeyName = "api_key";
        let date = new Date().toGMTString();
        let algorithm = "hmac-sha256"
        let headers = "host date request-line";
        // let signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v1.1/chat HTTP/1.1`;
        let signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v3.5/chat HTTP/1.1`;
        let signatureSha = CryptoJs.HmacSHA256(signatureOrigin, requestObj.APISecret);
        let signature = CryptoJs.enc.Base64.stringify(signatureSha);

        let authorizationOrigin = `${apiKeyName}="${requestObj.APIKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;

        let authorization = base64.encode(authorizationOrigin);

        // 将空格编码
        url = `${url}?authorization=${authorization}&date=${encodeURI(date)}&host=${host}`;

        resovle(url)
    })
}
/** 将信息添加到textare中
    在textarea中不支持HTML标签。
    不能使用
    标签进行换行。
    也不能使用\r\n这样的转义字符。

    要使Textarea中的内容换行，可以使用&#13;或者&#10;来进行换行。
    &#13;表示回车符；&#10;表示换行符；
*/
const addMsgToTextarea = (text) => {
    result.innerHTML = text;
}
