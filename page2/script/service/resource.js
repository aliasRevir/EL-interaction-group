const pathSeparator = "/";
const pathPreffix = "." + pathSeparator + "script" + pathSeparator + "service" + pathSeparator + "el";


class resource {
    /*
    getProblem
    输入：id:int题目编号(1 - 8)
    返回：problem对象
    */
    static getProblem(id) {
        id = String(id);
        console.log(id);
        var type = Math.floor((id-1) / 2) + 1;
        var textName = pathPreffix + pathSeparator + "type" + String(type) + pathSeparator + "test" + id + pathSeparator + "text" + pathSeparator + "test" + id + ".txt"
        const pbl = new problem();
        fetch(textName).then(response => {
            if (!response.ok) {
              throw new Error('File not found');
            }
            return response.text();
          })
          .then(data => {
            console.log("data: " + data);
            pbl.type = type;
            data = data.split("\r");
            if (type != 4) {
              pbl.descriptionSound = pathPreffix + pathSeparator + "type" + String(type) + pathSeparator + "test" + id + pathSeparator + "sound" + pathSeparator + "test" + id + ".mp3"
              pbl.description = data[0].split(':')[1];
              pbl.answer = data[1].split(':')[1].replace(',', '');
              pbl.wordList = data[2].split(':')[1].replace('[', '').replace(']', '').split(',');
            } else {
              pbl.descriptionSound = null;
              pbl.description = data[0].split(':')[1].replace('[', '').replace(']', '').split(',');
              pbl.wordList = data[1].split(':')[1].replace('[', '').replace(']', '').split(',');
              pbl.answer = data[1].split(':')[1].replace('[', '').replace(']', '');
            }
            for (let index = 0; index < pbl.wordList.length; index++) {
              pbl.wordList[index] = pbl.wordList[index].trim();
            }

            pbl.wordCount = pbl.wordList.length;
            pbl.wordSoundList = [];
            for (var i = 0; i < pbl.wordCount; i++) {
                pbl.wordSoundList.push(pathPreffix + pathSeparator + "type" + String(type) + pathSeparator + "test" + id + pathSeparator + "sound" + pathSeparator + "wordlist_sound" + pathSeparator +
                  "word" + String(i + 1) + ".mp3")
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
            console.log("error fetch?");
          //  test.textContent = error.message;//实际用的时候改一下这里
          });
    }
}


/*submit.addEventListener("click", check);*/

resource.getProblem(1);