function toggleNav() {
    const sidebar = document.getElementById("mySidebar");
    if (sidebar.style.width === "379px") {
        sidebar.style.width = "0";
    } else {
        sidebar.style.width = "379px";
    }
}
var story1=document.querySelector(".flame");
story1.addEventListener("click", function() {
    window.location= "upinflames.html";
});
var story2=document.querySelector(".city");
story2.addEventListener("click", function() {
    window.location= "the lost city.html";
});

document.addEventListener("DOMContentLoaded", function(event) {
    event.preventDefault(); 
    var submit = document.querySelector("#sub"); 
    submit.addEventListener("click", function() {
        alert('Question submitted successfully!'); 
    });
});
var story1=document.querySelector(".more");
story1.addEventListener("click", function() {
    window.location= "stories.html";
});