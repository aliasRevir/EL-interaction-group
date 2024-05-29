// include before resource.js

function logInfo(...data) {
    console.log(data);
}


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
        logInfo("init(", problem, ")");
        ; // BlankFillingProblem problem
        this.thisProblem = problem;
        this.clear();
        if(this.thisProblem.description != undefined) this.showStatement(this.thisProblem.description);
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
        document.querySelector(".boxAnswer").innerHTML = "";
    }
    static showStatement(statements) {
        logInfo("showStatement(", statements, ")");
        if (this.isRenderStatementIPA()) {
            for (let i = 0; i < this.thisProblem.descriptionTokenized.length; i++) {
                var word = this.thisProblem.descriptionTokenized[i];
                var wordipa = this.thisProblem.descriptionIPA[i];
                document.querySelector(".statementContainer").innerHTML += "<span class='statementToken'><span class='statementIPA'>" + wordipa + "</span><span class='statementText'>" + word + "</span></span>";
                
            }
        } else {
            document.querySelector(".statementContainer").innerText = statements;
        }
    }
    static showOptionList(wordList) {
        logInfo("showOptionList(", wordList, ")");
        for (var id = 0; id < wordList.length; id++) {
            this.showOptionListSingle(wordList[id], id);
        }
    }
    static showOptionListSingle(option, id) {
        logInfo("showOptionListSingle(", option, id, ")");
        ; // string option
        ; // int id
        var tempDOM = document.createElement("button");
        if (this.isRenderOptionIPA()) {
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
        logInfo("addAnswer(", id, ")");
        this.beAddAnswer(this.thisProblem.wordList[id]);
        var tempDOM = document.createElement("button");
        tempDOM.className = "answer";
        tempDOM.innerText = this.thisProblem.wordList[id];
        tempDOM.id = "state_" + id;
        document.querySelector(".boxAnswer").append(tempDOM);
        if (this.isHaveOptionSound()) this.playOptionSound(id);
        document.getElementById(tempDOM.id).addEventListener("click", function() {
            feController.deleteAnswer(id);
            feController.updateOption(id, true);
        }, true);
    }
    static deleteAnswer(id) {
        logInfo("deleteAnswer(", id, ")");
        this.beDeleteAnswer(this.thisProblem.wordList[id]);
        document.querySelector("#state_" + id).remove();
    }
    static updateOption(id, val) {
        document.querySelector("#btn_" + id).disabled = val ? false : true;
    }
    static playOptionSound(id) {
        var music = new Audio(this.thisProblem.wordSoundList[id]);
        music.play();
    }
    static playStatementSound(id) {
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
        } else {
            logInfo("OK you lose hahah");
        }
    }

    static isRenderOptionIPA() {
        if (this.thisProblem.type == 1) return true;
        if (this.thisProblem.type == 2) return false;
        if (this.thisProblem.type == 3) return false;
        if (this.thisProblem.type == 4) return false;
    }

    static isRenderStatementIPA() {
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

/*
var p = new problem;
p.statement = "题面";
p.wordList = ["选项一", "选项二", "三"];
feController.init(p);
*/