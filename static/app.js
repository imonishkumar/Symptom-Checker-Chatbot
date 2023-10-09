class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }

        this.state = false;
        this.messages = [];
    }

    display() {
        const {openButton, chatBox, sendButton, medicalcentres} = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if(this.state) {
            chatbox.classList.add('chatbox--active')
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);

        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1}),
            mode: 'cors',
            headers: {
               'Content-Type': 'application/json'
            },
          })
          .then(r => r.json())
          .then(r => {
            //let msg2 = { name: "Sam", message1: r.answer[0][0], message11: r.answer[0][1], prob1: r.answer[0][2], message2: r.answer[1][0], message21: r.answer[1][1], prob2: r.answer[1][2], message3: r.answer[2][0], message31: r.answer[2][1], prob3: r.answer[2][2]};
            let msg2 = {name: "Sam", message1: r.answer[0], message2: r.answer[1], message3: r.answer[2], message4: r.answer[3]}
            this.messages.push(msg2);
            this.updateChatText(chatbox)
            textField.value = ''

        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
        });
    }

    updateChatText(chatbox) {
        var html = '';
        const specificTags = ["greeting", "goodbye","work","who","Thanks","joke", "name", "age", "gender", "not_understand"]
        this.messages.slice().reverse().forEach(function(item, index) {
            
            if (item.name === "Sam")
            {
                /*html +=  '<div class="myDIV">' + item.message3 + item.prob3 + '</div>' 
                    + '<div class="hide">' + item.message31 +'</div>'
                    + '<div class="myDIV">' + item.message2 + item.prob2 + '</div>'
                    + '<div class="hide">' + item.message21 + '</div>'
                    + '<div class="myDIV">' + item.message1 + item.prob1 + '</div>'
                    + '<div class="hide">' + item.message11 + '</div>'
                    + '<div class="con" style="margin-top:20px; margin-bottom:10px"><h3>These may be the possible diseases that you may have.</h3></div>'
                */
                if (specificTags.includes(item.message1)){
                    html += '<div class="messages__item messages__item--visitor">' + item.message2 + '</div>'
                }
                else if (item.message1 === "center"){ 
                    html += '<div class="messages__item messages__item--visitor">You can ask me if you want any thing else.</div>'
                            + '<div class="myDIV" style="font-size: 17px;">' + item.message4[0] + ', ' + item.message4[1] + '</div>'
                            + '<div class="hide">' + item.message4[2] + '</div>'
                            + '<div class="myDIV" style="font-size: 17px;">' + item.message3[0] + ', ' + item.message3[1] + '</div>'
                            + '<div class="hide">' + item.message3[2] + '</div>'
                            + '<div class="myDIV" style="font-size: 17px;">' + item.message2[0] + ', ' + item.message2[1] + '</div>'
                            + '<div class="hide">' + item.message2[2] + '</div>'
                            + '<div class="con" style="margin-top:20px; margin-bottom:10px"><h3>Medical location that are near to you are.</h3></div>'
                }
                else{

                    html += '<div class="messages__item messages__item--visitor">Do you want to know about the nearby medical center locations</div>'
                            + '<div class="accordion" id="accordionExample">'
                                + '<div class="accordion-item" style="width: 40%; margin-top: 10px" >'
                                + '<h2 class="accordion-header" id="headingOne">'
                                + '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">'
                                + '<b>Precautions</b>'
                                + '</button>'
                                + '</h2>'
                                + '<div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">'
                                + '<div class="accordion-body">'
                                + item.message3
                                + '</div>'
                                + '</div>'
                                + '</div>'
                                + '</div>'
                            + '<div class="accordion" id="accordionExample">'
                                    + '<div class="accordion-item" style="width: 40%; margin-top: 10px" >'
                                    + '<h2 class="accordion-header" id="headingThree">'
                                    + '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">'
                                    + '<b>Description</b>'
                                    + '</button>'
                                    + '</h2>'
                                    + '<div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">'
                                    + '<div class="accordion-body">'
                                    + item.message2
                                    + '</div>'
                                    + '</div>'
                                    + '</div>'
                                    + '</div>'
                            + '<div class="messages__item messages__item--visitor">Here  is some more info on the disease</div>'
                            + '<div class="myDIV">' + item.message1 + '</div>'
                            + '<div class="con" style="margin-top:20px; margin-bottom:10px"><h3>This may be the possible disease that you may have.</h3></div>'   
                }
            }
            else
            {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }
          });
          html += '<div class="messages__item messages__item--visitor">Hi, this is a medical chat support.</div><div class="messages__item messages__item--visitor">May I know your name.</div>'

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
    
}


const chatbox = new Chatbox();
chatbox.display();
