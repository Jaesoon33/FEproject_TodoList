let today = new Date();
const formattedDate = today.toLocaleDateString(
    "en-US",
    {
        weekday: "long",
        month: "long",
        day: "numeric"
    }
)
document.getElementById("today_date").textContent = formattedDate
