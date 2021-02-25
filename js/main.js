//下記の変数はエラーがあるとtrueに変わります。
    //どうやって変わるのかは以降の処理でご確認ください。
    //true = ミスがある false = ミスが無い
    //後半でエラーが無いか判断する時に使います。
    var mailerrorbox = "true";
    var nameerrorbox = "true";

    var formarea = new Vue({
        el: '#formarea',
        data: {
            //v-modelの値がリアルタイムで反映されます。
            mailarea: "",
            namearea: "",
            textboxarea: "",
            //下記は「入力フォーム」と「確認用文字列」の表示項目を切り替えます。
            //trueとなっている項目は消えます。
            //v-bind:classでclassをつけたり消したりできます。
            //display:none;が設定されたclass(今回はdelatearea)がついたり消えたりします。
            //trueになった方が消えるのは、delateareaがtrueで付与されるためです。
            inputdata:false,
            makesure:true
        },
        computed:{
            //dataの値に変化があると、computedが機能します。
            //入力内容にミスが無いか確認する「バリデーションチェック」を行います。
            mailmiss: function () {
                //変数maildataの中にdataのmailareaの値を入力します。
                let maildata = this.mailarea
                //冒頭のmailerrorboxがここで使われます。
                //まず、mailareaに変更があった時に値をtrueにリセット。
                //次の処理でエラーがなかった場合にfalseになります。
                mailerrorbox = "true";
                //以降、if文でエラーチェックをします。
                if(!maildata){
                    //もし、maildataに何も入っていなかったら、下記のメッセージがmailmissに入ります。
                    //mailmissは{{mailmiss}}で出力できます。
                    return "メールが入ってないよ";
                }else if(maildata.match(/.+@.+\..+/)==null){
                    //もし、maildataに入力された内容がメールアドレスじゃなければ、下記のメッセージ。
                    //「/.+@.+\..+/」は正規表現と言われ、これでメールアドレスの形を確認しています。
                    return "メールの形式間違ってるよ";
                }else{
                    //もし、特にミスがなければ、falseになります。
                    //確認項目がすべてfalseの場合にのみ、メールが送信されます。
                    mailerrorbox = "false";
                };
            },
            //次は、名前のバリデーションチェックです。
            //名前は簡単で、未入力でなければfalseになります。
            //基本的にはメールチェックと同じです。
            namemiss: function () {
                //変数namedataの中にdataのmailareaの値を入力します。
                let namedata = this.namearea
                //エラー有無には冒頭で指定したnameerrorboxが使われています。
                nameerrorbox = "true";
                //以降、if文でエラーチェックをします。
                if(!namedata){
                    //もし、namedataに何も入っていなかったら、下記のメッセージがnamemissに入ります。
                    //namemissは{{namemiss}}で出力できます。
                    return "名前が入ってないよ";
                }else{
                    //もし、特にミスがなければ、falseになります。
                    //確認項目がすべてfalseの場合にのみ、メールが送信されます。
                    nameerrorbox = "false";
                }
            }
        },
        methods:{
            //methodで送信ボタンがクリックされた時の処理を書きます。
            //まず、確認ボタンが押された時からです。
            clickbtn: function () {
                //dataのinputdataにtrueを代入します。
                //するとhtmlのv-bind:classが指定された箇所でdelateareaが付与されます。
                this.inputdata = true
                //dataのmakesureにfalseを代入します。
                //するとhtmlのv-bind:classが指定された箇所でdelateareaが解除されます。
                this.makesure = false
                //上記だと、該当箇所の入力フォームが消えて、確認項目が表示されます。
            },
            //確認画面になった時、戻るボタンを押し、入力画面に戻る時の処理です。
            clickbtn_back: function () {
                this.inputdata = false
                this.makesure = true
                //上記だと、該当箇所の入力フォームが消えて、確認項目が表示されます。
            },
            //送信ボタンを押した時の処理です。
            clickbtn_send: function () {
                //mailerrorboxとnameerrorboxがそれぞれfalseであれば、エラー無しと判断。
                if(mailerrorbox == "false" && nameerrorbox == "false"){
                    //axiosという機能を使ってPHPファイルにデータを送信します。
                    //メールはPHPなどのバックエンド側の言語でしか送れません。
                    //よって、Vue.jsからPHPにデータを渡す必要があります。
                    //下記はデータをPHPに投げる時の1セットだと思ってください。
                    let params = new URLSearchParams();
                    //mailareaという箱の中にdata、mailareに入力された内容を入れます。
                    params.append('mailarea', this.mailarea);
                    //nameareaという箱の中にdata、nameareaに入力された内容を入れます。
                    params.append('namearea', this.namearea);
                    //textboxareaという箱の中にdata、textboxareaに入力された内容を入れます。
                    params.append('textboxarea', this.textboxarea);
                    //axiosという機能を使いデータを投げます。
                    axios.post('functions/mail.php', params)
                    //PHPで処理された結果がresponseに帰ってきます。
                    .then(function (response) {
                        //PHPで処理された結果はresponse.dataで呼び出せます。
                        //今回は、送信完了メッセージが入っています。
                        //詳しくはPHPファイルを確認してみてください。
                        //alertで送信完了メッセージを出します。
                        alert(response.data)
                        //フォームのトップページにリダイレクトします。
                        document.location = "./"
                    })
                    .catch(function (error) {
                        //何かエラーが起きたらconsole.logにエラーを表示させます。
                        console.log("error");
                    })
                };
            }
        }
    })  
