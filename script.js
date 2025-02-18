const cross = document.getElementById("cross");
const menubar = document.getElementById("menubar");
const logo = document.getElementById("logo");
const nav = document.getElementById("nav")
const header = document.getElementById("header");
const body = document.getElementById("body");
const main = document.getElementById("mainm");
const Hyp = document.getElementById("hp");
const wall = document.getElementById("wall");
const curr = document.getElementById("focus");
const front = document.getElementById("front");
const cbtn = document.getElementById("cbtn")
let sr;

function logoShift() {
logo.style.marginLeft = "60vw";
// curr.style.alignSelf = "flex-end";
front.style.width = "100vw";
front.style.opacity = "0";
menubar.style.opacity = "0"
}

menubar.addEventListener("click", () => {
    menubar.style.rotate = "90deg"
    nav.style.left = "0";
    cross.style.rotate = "180deg"
    logoShift();
    sr=true;
});

if(sr=true){
    cbtn.setAttribute("href" , "")

wall.addEventListener("click", () =>{
    menubar.style.rotate = "0deg"
    cross.style.rotate = "90deg"
    nav.style.left = "-50%";
    logo.style.marginLeft = "3vw"
    front.style.width = "30vw";
    front.style.opacity = "1";
    menubar.style.opacity = "1"
    sr=false;
    
});

front.addEventListener("click", () =>{
    menubar.style.rotate = "0deg"
    cross.style.rotate = "90deg"
    nav.style.left = "-50%";
    logo.style.marginLeft = "3vw"
    front.style.width = "30vw";
    front.style.opacity = "1";
    menubar.style.opacity = "1"
    sr=false;
    
}) 
};


cross.addEventListener("click", () => {
    menubar.style.rotate = "0deg"
    cross.style.rotate = "90deg"
    nav.style.left = "-50%";
    logo.style.marginLeft = "3vw"
    front.style.width = "30vw";
    front.style.opacity = "1";
    menubar.style.opacity = "1"
});

window.addEventListener("scroll", () =>{
    if(window.scrollY>100){
        logo.style.filter = "invert()"
        header.style.transition = "all ease .5s";
        header.style.backgroundColor = "white";
        menubar.style.color = "black"
        
    }

    else if(window.scrollY>150){
        nav.style.opacity = "0%"
    }

   

    else{
        // header.style.transition = "all ease 0.5s";
        header.style.backgroundColor = "";
        logo.style.transition = "all ease .5s";
        logo.style.filter = "none"
        menubar.style.color = ""
    }
})

window.onload = () =>{
    main.style.opacity = "0";
    setTimeout(()=>{
        Hyp.style.opacity = "0";
        main.style.opacity = "1";
    },100)
}

// const myArr = ["salman" , "srk"]

// let myArr2 = myArr.push("chirag")

// console.log(typeof myArr)














