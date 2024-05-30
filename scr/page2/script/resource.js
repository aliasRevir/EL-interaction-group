const pathSeparator = "/";
const pathPreffix = ".." + pathSeparator + "problem";


class resource {

    static trimAll(strArray) {
      for (var i = 0; i < strArray.length; i++) {
        strArray[i] = strArray[i].trim();
      }
      return strArray;
    }
    static concatAll(strArray) {
      var ret = "";
      for (var i = 0; i < strArray.length; i++) {
        ret += strArray[i];
      }
      return ret;
    }
    static getList(str) {
      return this.trimAll(str.split(':')[1].replace('[', '').replace(']', '').split(","));
    }
    /*
    getProblem
    输入：id:int题目编号(1 - 8)
    返回：problem对象
    */
    static getProblem(type, id) {
        logInfo("getProblem()", type, id);
        id = String(id);
        var textName = pathPreffix + pathSeparator + "type" + String(type) + pathSeparator + "test" + id + pathSeparator + "text" + pathSeparator + "test" + id + ".txt"
        const pbl = new problem();
        fetch(textName).then(response => {
            if (!response.ok) {
              throw new Error('File not found');
            }
            return response.text();
          })
          .then(data => {
            console.log("data: ", data);

            pbl.type = type;

            // delete whitespace
            data = this.trimAll(data.split("\n"));

            // 其实我觉得这个格式设计的还是不咋地
            // 应该统一一下，题面就是题面，选项就是选项，只是题面和选项都有可选音频
            // 。。。不管了

            if (type == 1) {
              pbl.description      = data[0].split(':')[1];
              pbl.descriptionSound = pathPreffix + pathSeparator + "type" + String(type) + pathSeparator + "test" + id + pathSeparator + "sound" + pathSeparator + "test" + id + ".mp3";

              pbl.descriptionTokenized = null;
              pbl.descriptionIPA       = null;

              pbl.wordList      = this.getList(data[2]);
              pbl.wordIPAList   = this.getList(data[3]);
              pbl.wordSoundList = [];
              for (var i = 0; i < pbl.wordList.length; i++) {
                pbl.wordSoundList.push(pathPreffix + pathSeparator + "type" + String(type) + pathSeparator + "test" + id + pathSeparator + "sound" + pathSeparator + "wordlist_sound" + pathSeparator +
                  "word" + String(i + 1) + ".mp3")
              }
              pbl.answer        = data[1].split(':')[1];
            }
            if (type == 2) {
              pbl.description      = data[1].split(':')[1];
              pbl.descriptionSound = pathPreffix + pathSeparator + "type" + String(type) + pathSeparator + "test" + id + pathSeparator + "sound" + pathSeparator + "test" + id + ".mp3";

              pbl.descriptionTokenized = this.getList(data[2]);
              pbl.descriptionIPA       = this.getList(data[3]);

              pbl.wordList      = this.getList(data[4]);
              pbl.wordIPAList   = null;
              pbl.wordSoundList = null;
              pbl.answer        = this.getList(data[0]);
            }
            if (type == 3) {
              pbl.description      = data[1].split(':')[1];
              pbl.descriptionSound = pathPreffix + pathSeparator + "type" + String(type) + pathSeparator + "test" + id + pathSeparator + "sound" + pathSeparator + "test" + id + ".mp3";

              pbl.descriptionTokenized = null;
              pbl.descriptionIPA       = null;

              pbl.wordList      = this.getList(data[2]);
              pbl.wordIPAList   = null;
              pbl.wordSoundList = null;
              pbl.answer        = this.getList(data[0]);
            }

            if (type == 4) {
              pbl.description      = this.getList(data[0]);
              pbl.descriptionSound = null;

              pbl.descriptionTokenized = null;
              pbl.descriptionIPA       = null;

              pbl.wordList      = this.getList(data[1]);
              pbl.wordIPAList   = null;
              pbl.wordSoundList = null;
              pbl.answer        = this.concatAll(this.getList(data[1]));
            }

            console.log(pbl);
            feController.init(pbl);
          /*
          //下面这一段用来看读取是否正确
          test.textContent = "ok";
          wordlistSound.textContent ="wordSoundlist:" + pbl.wordSoundList;
          wordlist.textContent = "wordlist:" + pbl.wordList;
          answer.textContent = "answer:" + pbl.answer;
          description.textContent = "description:" + pbl.description;
          descriptionSoundPath.textContent ="descriptionSoundPath:" + pbl.descriptionSound;
          console.log("finish");
          */
            return pbl;
          })
          .catch(error => {
            console.log(error, "error fetch?");
          //  test.textContent = error.message;//实际用的时候改一下这里
          });
    }
}


/*submit.addEventListener("click", check);*/


{
var lvstt = strToArr(localStorage.getItem("levelStat"));
var cur_id = parseInt(localStorage.getItem("levelProgress"));
resource.getProblem(lvstt[cur_id][0],lvstt[cur_id][1]);
}