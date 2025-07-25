async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("username", data.username);

    if (data.role === "AD") {
      window.location.href = "ad_dashboard.html";
    } else {
      alert("Only AD role is supported now");
    }
  } else {
    alert(data.message || "Login failed");
  }
}
