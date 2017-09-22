
var db = 1; // Отладка

var bsObj = lib().entries(); // Объект с блоками (blocks)
var ssObj = libByName("Новые участки"); // Объект с участками (sites)
var nObj = libByName("Не заходить"); // Объект с данными куда не заходить (no)


for (keyB in bsObj) { // Перебираем все добавленные блоки
    var bObj = bsObj[keyB]; // Объект с данными блока (block)
    var bWord = bObj.field("Буква"); // Буква блока
    var bHome = bObj.field("Многоэтажки"); // Объект с многоэтажками блока

//log(bObj.field("нет")); break;
    var sDObj = {};

         var v = 0;
         while (v < 10) { // Генирация участков
             var s = bWord+"-"+v; // Название участка
             sDObj[s] = {};
             sDObj[s]["n"] = v;
             sDObj[s]["h"] = {};

             var kvMax = 0;
             for (keyH in bHome) { // Перебираем многоэтажки блока
                var hObj = bHome[keyH]; // Объект с данными многоэтажки (home)
                var hKv = hObj.field("Кв"); // Кв в многоэтажке
                var hName = hObj.name; // Название многоэтажки
                if (!hKv) hKv = 200; // Если нет данных о колличнствн квартир
                
                sDObj[s]["h"][hName] = {};

                var k = v;
                while (k <= hKv) { // Генирация квартир для 
                     if (k != 0) {
                         var fNo = nObj.findByKey(hName+" - "+k); // Проверка на наличие в библиотеке Не заходить
                         if (fNo) sDObj[s]["h"][hName][k] = 0;
                         else sDObj[s]["h"][hName][k] = 1;
                     }
                     k = k + 10;
                 } // Конец генирации квартир

                 if (kvMax < hKv) kvMax = hKv;
             } // Конец перебора многоэтажек
             sDObj[s]["m"] = kvMax;
             v++;
         } //Конец генирации участков

    for (keyS in sDObj) { // Перебор и запись созданных участков
        var sObj = sDObj[keyS]; // Объект с участком
        var sNum = sObj["n"]; // Номер участка
        var sMax = sObj["m"]; // Максимум квартир на участке
        var sHObj = sObj["h"]; // Объект с домами участка
        
        var neZhH = "<div style=\"text-align: right;\"><font size=\"6\">"+keyS+"</font></div><ul>";
        for (keySH in sHObj) { // Перебор домов участка
            var shoObj = sHObj[keySH]

            var neZh = "";
            for (keyKv in shoObj) { // Перебор квартир дома
                if(shoObj[keyKv] == 0) {
                    if (neZh != "") neZh += ", ";
                    neZh += keyKv;
                }
            } // Конец перебора квартир дома

              
          //     if (neZhH != "") neZhH += "\n";
               neZhH += "<li>"+keySH;
               if (neZh != "") neZhH += " (<span style=\"color: rgb(244, 67, 54);\">Не заходить:</span> "+neZh+")";
               neZhH += "</li>";
           
        } // Конец перебора домов участков
        neZhH += "</ul>";
        
        var allKv = "";
        var k = sNum;
        while (k <= sMax) { // Генирация общего списка квартир для участка
           if (k != 0) {
               if (allKv != "") allKv += ", ";
               allKv += k;
           }
           k = k + 10;
        }

        neZhH += "<div style=\"text-align: center;\"><font size=\"2\">"+allKv+"</font></div>";

        var sSite = ssObj.findByKey(keyS);
        if (sSite) {
            if (db) log("Обновляем "+keyS);
        } else {
            if (db) log("Дбавляем "+keyS);
            var addObj = {};
            addObj["Номер"] = sNum;
          //  addObj["Кв"]  = allKv;
            addObj["Карточка"] = neZhH;
            var cObj = ssObj.create(addObj);
            cObj.set("Блок", bObj);         
        }

    } // Конец перебора созданных участков
} // Конец перебора добавленных блоков
