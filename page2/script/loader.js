
// you can use:
// function initPage(BlankFillingProgram program);




// you should implement:
// function submit(int[] answers);

function submit(answers) {
    console.log("submit(answers) answers = " + answers);
}



/*  - interface -  */

function initPage(problem) {
    ; // BlankFillingProblem problem
    feController.init(problem);
}

class BlankFillingStatement {
    // boolean isBlank
    // string content
    constructor(isBlank, content) {
        this.isBlank = isBlank;
        this.content = content;    
    }
}

class BlankFillingProblem {
    // BlankFillingStatement[] statements;
    // string[] options
    // ;
    // int blankCount;
    // int[] answers; // kth blank has option a_k
    constructor(statements, options) {
        this.statements = statements;
        this.options = options;
        this.blankCount = 0;
        this.fillCount = 0;
        this.answers = [];
        for (var id = 0; id < statements.length; id++) {
            if (statements[id].isBlank) this.blankCount ++;
        }
    }
    addAnswer(id) {
        // string answer
        if (this.answers.length == this.blankCount) {
        //  feController
        } else {
            this.answers.push(id);
            feController.updateBlank(this.answers.length - 1, this.options[id]);
            feController.updateOption(id, 0);
        }
    }
    deleteAnswer() {
        if (this.answers.length == 0) {
            console.log("deleteAnswer(): failed cuz len = 0\n");
        } else {
            var id = this.answers[this.answers.length - 1];
            this.answers.pop();
            feController.updateBlank(this.answers.length, "");
            feController.updateOption(id, 1);
        }
    }
    submitAnswer() {
        if (this.answers.length == this.blankCount) {
            submit(this.answers);
        }
    }
}


class feController {
    static init(problem) {
        ; // BlankFillingProblem problem
        thisProblem = problem;
        this.showStatement(problem.statements);
        this.showOption(problem.options);
        this.addManyListener();
    }
    static showStatement(statements) {
        ; // BlankFillingStatement[] statements
        var blank_id = 0;
        for (var id = 0; id < statements.length; id++) {
            this.showStatementSingle(statements[id], blank_id);
            if (statements[id].isBlank) {
                blank_id ++;
            }
        }
    }
    static showStatementSingle(statement, id) {
        var tempDOM = document.createElement("span");
        if (statement.isBlank == true) {
            tempDOM.className = "statement statement_blank";
            tempDOM.id = "blank_" + id;
            tempDOM.innerText = "　";
        } else {
            tempDOM.className = "statement";
            tempDOM.innerText = statement.content;
        }
        document.querySelector(".boxQuestion").append(tempDOM);
    }
    static showOption(options) {
        ; // String[] options
        for (var id = 0; id < options.length; id++) {
            this.showOptionSingle(options[id], id);
        }
    }
    static showOptionSingle(option, id) {
        ; // string option
        ; // int id
        var tempDOM=document.createElement("button");
        tempDOM.className = "option_btn";
        tempDOM.innerText = option;
        tempDOM.id = "btn_" + id;
        document.querySelector(".boxAnswer").append(tempDOM);
        document.getElementById(tempDOM.id).addEventListener("click", function() {
            thisProblem.addAnswer(id);
        }, true);
    }
    static addManyListener() {
        document.querySelector("#btnUndo").addEventListener("click", function() {
            thisProblem.deleteAnswer();
        }, true);
        document.querySelector("#btnSubmit").addEventListener("click", function() {
            thisProblem.submitAnswer();
        }, true);
    }
    static updateBlank(id, val) {
        console.log(id + " val = " + val);
        if (val == "") val = "　";
        document.querySelector("#blank_" + id).innerText = val;
    }
    static updateOption(id, val) {
        document.querySelector("#btn_" + id).disabled = val ? false : true;
    }
}

var thisProblem;









/* */

tmp1 = new BlankFillingStatement(false, "在对照实验中，控制自变量可以采用")
tmp2 = new BlankFillingStatement(true, "")
tmp3 = new BlankFillingStatement(false, "或")
tmp4 = new BlankFillingStatement(true, "")
tmp5 = new BlankFillingStatement(false, "。")

var curProb = new BlankFillingProblem([tmp1, tmp2, tmp3, tmp4, tmp5], ["加法原理", "减法原理", "乘法原理", "除法原理"]);

initPage(curProb);
