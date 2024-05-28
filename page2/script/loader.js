
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
    wordCount;        //int 选项数量
    wordList;         //string [] 选项名字
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
        if(this.thisProblem.description != undefined) this.showDescription(this.thisProblem.description);
        this.showWordList(this.thisProblem.wordList);
    }
    static clear() {
        this.thisWordBlank = new wordBlank;
        // tbd
        document.querySelector(".boxDescription").innerText = "";
        document.querySelector(".boxAnswer").innerHTML = ""
    }
    static showDescription(statements) {
        document.querySelector(".boxDescription").innerText = statements;
    }
    static showWordList(wordList) {
        logInfo("showWordList(", wordList, ")");
        for (var id = 0; id < wordList.length; id++) {
            this.showWordListSingle(wordList[id], id);
        }
    }
    static showWordListSingle(option, id) {
        logInfo("showWordListSingle(", option, id, ")");
        ; // string option
        ; // int id
        var tempDOM = document.createElement("button");
        tempDOM.className = "option_btn";
        tempDOM.innerText = option;
        tempDOM.id = "btn_" + id;
        document.querySelector(".boxAnswer").append(tempDOM);
        document.getElementById(tempDOM.id).addEventListener("click", function() {
            feController.addAnswer(id);
            feController.updateOption(id, false);
        }, true);
    }
    static addAnswer(id) {
        logInfo("addAnswer(", id, ")");
        var tempDOM = document.createElement("button");
        tempDOM.className = "statement statement_blank";
        tempDOM.innerText = this.thisProblem.wordList[id];
        tempDOM.id = "state_" + id;
        document.querySelector(".boxQuestion").append(tempDOM);
        this.playOptionSound(id);
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
}