
// you can use:
// function initPage(BlankFillingProgram program);




// you should implement:
// function submit(int[] answers);

function submit(answers) {
    console.log("submit(answers) answers = " + answers);
}
function logInfo(...data) {
    console.log(data);
}


/*  - interface -  */

function initPage(problem) {
    ; // BlankFillingProblem problem
    feController.init(problem);
}

class wordBlank{
    wordList;
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
    static init(problem) {
        logInfo("init(", problem, ")");
        ; // BlankFillingProblem problem
        this.thisProblem = problem;
        this.clear();
        if(this.thisProblem.description != undefined) this.showStatement(this.thisProblem.description);
        this.showOptionList(this.thisProblem.wordList);
    }
    static clear() {
        logInfo("clear()");
        this.thisWordBlank = new wordBlank;
        // tbd
        document.querySelector(".boxStatement").innerHTML = "";
        document.querySelector(".boxAnswer").innerHTML = "";
        document.querySelector(".boxOption").innerHTML = "";
    }
    static showStatement(statements) {
        logInfo("showStatement(", statements, ")");
        if (this.isRenderStatementIPA()) {
            for (let i = 0; i < this.thisProblem.descriptionTokenized.length; i++) {
                var word = this.thisProblem.descriptionTokenized[i];
                var wordipa = this.thisProblem.descriptionIPA[i];
                document.querySelector(".boxStatement").innerHTML += "<span class='statementToken'><span class='statementIPA'>" + wordipa + "</span><span class='statementText'>" + word + "</span></span>";
                
            }
        } else {
            document.querySelector(".boxStatement").innerText = statements;
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
        document.querySelector("#state_" + id).remove();
    }
    static updateOption(id, val) {
        document.querySelector("#btn_" + id).disabled = val ? false : true;
    }
    static playOptionSound(id) {
        var music = new Audio(this.thisProblem.wordSoundList[id]);
        music.play();
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
}

/*
var p = new problem;
p.statement = "题面";
p.wordList = ["选项一", "选项二", "三"];
feController.init(p);
*/