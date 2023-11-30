const chatInput = document.querySelector("#chat-input");
const sendBtn = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeBtn=document.querySelector("#theme-btn");
const deletebtn=document.querySelector("#delete-btn");

let userText = null;
const API_KEY="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";
const initialHeight = chatInput.scrollHeight;

const loadDataFromLocalstorage = () =>{
    const themeColor=localStorage.getItem("theme-color");

    document.body.classList.toggle("light-mode" , themeColor === "light_mode");
    themeBtn.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

    const defaultText=`<div class=""default-text">
                         <h1>Chatgbt Clone </h1>
                         <p> Start a conversation and explore the power of AI <br>. You chat history will be displayed here </p>    
                        </div>`;

    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTop(0,chatContainer,scrollHeight);
}

loadDataFromLocalstorage();

const createElement = (html, className) => {
    // create new div and apply chat, specified class and set htl content of div
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className); // Fix here
    chatDiv.innerHTML = html;
    return chatDiv;  // Return the created chat div
}

const getChatResponse = async(incomingChatDiv) => {
    const API_URL=" https://api.openai.com/v1/completions";
    const pElement=document.createElement("p");

    // Define the properties and data for the API request
    const requestOptions = {
        method:"POST",
        headers:{
           
            "Content-Type":`application/json`,
            "Authorization":`Bearer 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`
        },

        body:JSON.stringify({
            model: "gpt-3.5-turbo-instruct",
            prompt: userText,
            max_tokens: 2048,
            temperature: 0.2,
          //  n:1,
           // stop:null
        })
    }


    // send POST request to API, get response and set the response as paragraph element text
    try{
        const response = await(await fetch(API_URL,requestOptions)).json();
        pElement.textContent = response.text;
        //pElement.textContent = response.chocies[0].text.trim();

    }catch(error){
       pElement.classList.add("error");
       pElement.textContent="Oops! Somethig went wrong while retriving the response. Please try again!"
    }

    // Remove the typing animation, append the paragraph element and save the chats to local storage
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    chatContainer.scrollTop(0,chatContainer.scrollHeight);
    localStorage.setItem("all-chats",chatContainer.innerHTML);

}

const copyResponse = (copyBtn) => {
    //copy the text content of the response to the clipboard
    const responseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(responseTextElement.textContent);
    copyBtn.textContent="done";
    setTimeout(() =>  copyBtn.textContent="content_copy",1000);
    
}


const showTypingAnimation = () => {
    const html = `
    <div class="chat-content">
        <div class="chat-details">
            <img src="chatgbt.webp" alt="chatgbt">
                <div class="typing-animation">
                    <div class="typing dot" style="--delay:0.2s"></div>
                    <div class="typing dot" style="--delay:0.2s"></div>
                    <div class="typing dot" style="--delay:0.2s"></div>
                </div>
        </div>
        <span onclick="copyResponse(this)" class="material-symbols-outlined">content_copy</span>
    </div>`;

 // Create an incoming chat div with user's message and append it to chat container
 const incomingChatDiv = createElement(html, "incoming");
 chatContainer.appendChild(incomingChatDiv);
 chatContainer.scrollTop(0,chatContainer.scrollHeight);
 getChatResponse(incomingChatDiv);



}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim();    // Get input value and remove extra spaces
    if(!userText) return;   // If chatgbt is empty return from here

    chatInput.value="";
    chatInput.style.height = `${initialHeight}px`;


    const html = `
        <div class="chat-content">
            <div class="chat-details">
                <img src="user.avif" alt="user">
                <p></p>
            </div>
        </div>`;
    
    // Create an outgoing chat div with user's message and append it to chat container
    const outgoingChatDiv = createElement(html, "outgoing");
    outgoingChatDiv.querySelector("p").textContent=userText;
    chatContainer.appendChild(outgoingChatDiv);

    document.querySelector(".default-text")?.remove();

    //await new Promise(resolve => setTimeout(resolve, 2000));
    chatContainer.scrollTop(0,chatContainer.scrollHeight);
    setTimeout(showTypingAnimation,500);
}

themeBtn.addEventListener("click",() =>{
    // toggle body's class for the theme mode and save the updated theme to the local storage
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme-color",themeBtn.innerText);
    themeBtn.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

deletebtn.addEventListener("click", () =>{
    // Remove the chats from local storage and call loadDataFromLocalstorage function
    if(confirm("Are you sure you want to delet all the chats?")){
        localStorage.removeItem("all-chats");
        loadDataFromLocalstorage();
    }
});




chatInput.addEventListener("input" , () =>{
    //Adjust the height of the input field aynamicallyy based on its content
    chatInput.style.height = `${initialHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown" , (e) =>{
    // if the Enter key is pressed without shift and the window width is larger
    // than 800 pixels, handle the outgoing chat
   if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
    e.preventDefault();
    handleOutgoingChat();
   }
});

sendBtn.addEventListener("click", handleOutgoingChat); // Fix here
