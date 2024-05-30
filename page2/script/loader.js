// include before resource.js

function logInfo(...data) {
    console.log(data);
}


/* level data */

const levels = [
    /* 每一行是一关，元素是 [类型, id] */
    [[1,1],[1,2],[2,1],[3,6],[4,1]],
    [[4,2],[1,4],[2,2],[3,4]],
    [[1,5],[2,6],[4,3],[1,7]],
    [[1,9],[2,3],[4,4],[3,3]],
    [[2,7],[2,10],[1,6],[4,5]],
    [[4,6],[1,10],[3,2],[4,7]],
    [[1,8],[4,8],[2,8],[2,9]],
    [[3,7],[3,8],[3,9],[3,10]],    //刚好是四句上下文,还挺有意思
    [[1,3],[2,4],[2,5],[4,9]],
    [[3,1],[3,5],[4,10]]
];

function arrToStr (arr) {
    var ret = "";
    for (let i = 0; i < arr.length; i++) {
        ret = ret + arr[i][0] + ":" + arr[i][1];
        if (i + 1 < arr.length) {
            ret = ret + ",";
        }
    }
    return ret;
}

function strToArr (str) {
    var ret = [];
    str = str.split(",");
    for (let i = 0; i < str.length; i++) {
        ret.push(Array(parseInt(str[i].split(":")[0]),parseInt(str[i].split(":")[1])));
    }
    return ret;
}

function getRandomizedPermutation (len) {
    
    logInfo("getRandomizedPermutation()", len);
    arr = Array();
    for (let i = 0; i < len; i++) {
        arr.push(i);
    }
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function shuffleWithGivenOrder (arr, order) {
    logInfo("shuffleWithGivenOrder()", arr, order);
    ret = Array();
    for (let i = 0; i < arr.length; i++) {
        ret.push(arr[order[i]]);
    }
    return ret;
}

if (localStorage.getItem("onProcess") == undefined) { localStorage.setItem("onProcess", 1); }
if (localStorage.getItem("maxProcess") == undefined) { localStorage.setItem("maxProcess", 1); }
localStorage.setItem("levelStat", arrToStr(levels[localStorage.getItem("onProcess") - 1]));
localStorage.setItem("levelProgress", 0);

/*  - interface -  */

function initPage(problem) {
    ; // BlankFillingProblem problem
    feController.init(problem);
}

class problem {
    type;             //int 题型
    description;      //string 题面
    descriptionSound; //type(1-3) : string src路径 type(4):null(这个题型没声音)

    descriptionTokenized; // string [] 题面（按字分开）
    descriptionIPA;       // string [] 音标（按字分开）

    wordList;         //string [] 选项名字
    wordIPAList       //string [] 音标
    wordSoundList;    //string [] src路径(与wordList一一对应)
    answer;           //string 答案
}



class feController {
    static thisProblem;
    static thisWordBlank;
    static isStaticButtonInitialized;
    static init(problem) {
        logInfo("init()", problem);
        ; // BlankFillingProblem problem
        this.thisProblem = problem;
        this.clear();
        if(this.thisProblem.description != undefined) this.showStatement(this.thisProblem.description);

        this.shuffleOptionList();
        this.showOptionList(this.thisProblem.wordList);

        if(!this.isStaticButtonInitialized) this.attachListener();
    }
    static clear() {
        logInfo("clear()");
        document.querySelector(".statementContainer").innerHTML = "";
        this.clearAnswer();
        document.querySelector(".boxOption").innerHTML = "";
    }
    static clearAnswer() {
        this.beClearAnswer();
        document.querySelector(".answerContainer").innerHTML = "";
    }
    static showStatement(statements) {
        logInfo("showStatement()", statements);
        if (this.isHaveStatementIPA()) {
            for (let i = 0; i < this.thisProblem.descriptionTokenized.length; i++) {
                var word = this.thisProblem.descriptionTokenized[i];
                var wordipa = this.thisProblem.descriptionIPA[i];
                document.querySelector(".statementContainer").innerHTML += "<span class='statementToken'><span class='statementIPA'>" + wordipa + "</span><span class='statementText'>" + word + "</span></span>";
                
            }
        } else {
            document.querySelector(".statementContainer").innerText = statements;
        }
    }
    static shuffleOptionList() {
        var ord = getRandomizedPermutation(this.thisProblem.wordList.length);
        this.thisProblem.wordList = shuffleWithGivenOrder(this.thisProblem.wordList, ord);
        if (this.isHaveOptionIPA()) {
            this.thisProblem.wordIPAList = shuffleWithGivenOrder(this.thisProblem.wordIPAList, ord);
        }
        if (this.isHaveOptionSound()) {
            this.thisProblem.wordSoundList = shuffleWithGivenOrder(this.thisProblem.wordSoundList, ord);
        }
    }
    static showOptionList(wordList) {
        logInfo("showOptionList()", wordList);
        for (var id = 0; id < wordList.length; id++) {
            this.showOptionListSingle(wordList[id], id);
        }
    }
    static showOptionListSingle(option, id) {
        logInfo("showOptionListSingle()", option, id);
        ; // string option
        ; // int id
        var tempDOM = document.createElement("button");
        if (this.isHaveOptionIPA()) {
            tempDOM.innerHTML = "<span class='optionIPA'>" + this.thisProblem.wordIPAList[id] + "</span><span class='optionText'>" + option + "</span>";
        } else {
            tempDOM.innerHTML = "<span class='optionText'>" + option + "</span>";
        }
        tempDOM.className = "option_btn";
        tempDOM.id = "btn_" + id;
        document.querySelector(".boxOption").append(tempDOM);
        document.getElementById(tempDOM.id).addEventListener("click", function() {
            feController.addAnswer(id);
            feController.updateOption(id, false);
        }, true);
    }
    static addAnswer(id) {
        logInfo("addAnswer()", id);
        this.beAddAnswer(this.thisProblem.wordList[id]);
        var tempDOM = document.createElement("button");
        tempDOM.className = "answer";
        tempDOM.innerText = this.thisProblem.wordList[id];
        tempDOM.id = "state_" + id;
        document.querySelector(".answerContainer").append(tempDOM);
        if (this.isHaveOptionSound()) this.playOptionSound(id);
        document.getElementById(tempDOM.id).addEventListener("click", function() {
            feController.deleteAnswer(id);
            feController.updateOption(id, true);
        }, true);
    }
    static deleteAnswer(id) {
        logInfo("deleteAnswer()", id);
        this.beDeleteAnswer(this.thisProblem.wordList[id]);
        document.querySelector("#state_" + id).remove();
    }
    static updateOption(id, val) {
        logInfo("updateOption()", id, val);
        document.querySelector("#btn_" + id).disabled = val ? false : true;
    }
    static playOptionSound(id) {
        logInfo("playOptionSound()", id);
        var music = new Audio(this.thisProblem.wordSoundList[id]);
        music.play();
    }
    static playStatementSound() {
        logInfo("playStatementSound()");
        var music = new Audio(this.thisProblem.descriptionSound);
        music.play();
    }

    static attachListener() {
        this.isStaticButtonInitialized = true;
        document.getElementById("btnSubmit").addEventListener("click", function() {
            feController.submitAnswer();
        }, true);
        document.getElementById("btnClear").addEventListener("click", function() {
            for (let i = 0; i < feController.thisProblem.wordList.length; i++) {
                document.getElementById("btn_" + i).disabled = false;
            }
            feController.clearAnswer();
        }, true);
        document.querySelector(".statementContainer").addEventListener("click", function(){
            if (feController.isHaveStatementSound()) {
                feController.playStatementSound();
            }
        }, true);
    }

    static submitAnswer() {
        if (feController.checkAnswer() == true) {
            logInfo("OK you win");
            if (true) {
                var lvstt = strToArr(localStorage.getItem("levelStat"));
                var cur_id = parseInt(localStorage.getItem("levelProgress"));
                if (cur_id + 1 < lvstt.length) {
                    cur_id ++;
                    localStorage.setItem("levelProgress", cur_id);
                    resource.getProblem(lvstt[cur_id][0],lvstt[cur_id][1]);
                } else {
                    if (parseInt(localStorage.getItem("onProcess")) >= parseInt(localStorage.getItem("maxProcess"))) {
                        localStorage.setItem("maxProcess", parseInt(localStorage.getItem("onProcess")) + 1);
                    }
                    // jump back.
                    window.location.href = "../page1";
                }
            }
        } else {
            logInfo("OK you lose hahah");
        }
    }

    static isHaveOptionIPA() {
        if (this.thisProblem.type == 1) return true;
        if (this.thisProblem.type == 2) return false;
        if (this.thisProblem.type == 3) return false;
        if (this.thisProblem.type == 4) return false;
    }

    static isHaveStatementIPA() {
        if (this.thisProblem.type == 1) return false;
        if (this.thisProblem.type == 2) return true;
        if (this.thisProblem.type == 3) return false;
        if (this.thisProblem.type == 4) return false;
    }

    static isHaveOptionSound() {
        if (this.thisProblem.type == 1) return true;
        if (this.thisProblem.type == 2) return false;
        if (this.thisProblem.type == 3) return false;
        if (this.thisProblem.type == 4) return false;
    }

    static isHaveStatementSound() {
        if (this.thisProblem.type == 1) return false;
        if (this.thisProblem.type == 2) return true;
        if (this.thisProblem.type == 3) return true;
        if (this.thisProblem.type == 4) return false;
    }

    static beClearAnswer() {
        this.thisWordBlank = Array();
    }

    static beAddAnswer(word) {
        this.thisWordBlank.push(word);
    }

    static beDeleteAnswer(word) {
        this.thisWordBlank = this.thisWordBlank.filter(name => {return name != word});
        // 选项互不相同
    }


    static checkAnswer() {
        var ret = "";
        for (let i = 0; i < this.thisWordBlank.length; i++) {
            ret += this.thisWordBlank[i];
        }
        if (ret == this.thisProblem.answer) return true;
        else return false;
    }
}
