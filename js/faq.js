document.addEventListener("DOMContentLoaded", function(event) {
    event.preventDefault(); 
    var submit = document.querySelector("#sub"); 
    submit.addEventListener("click", function() {
        alert('Question submitted successfully!'); 
    });
});

function toggleNav() {
    const sidebar = document.getElementById("mySidebar");
    if (sidebar.style.width === "379px") {
        sidebar.style.width = "0";
    } else {
        sidebar.style.width = "379px";
    }
}