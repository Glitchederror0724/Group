document.addEventListener("DOMContentLoaded", () => {
  console.log("working");

  // ------------------ Hardcoded group info ------------------
  const groupInfo = {
    name: "Demo Roblox Group",
    description: "This is a demo Roblox group description. Everything here is fully static and works on GitHub Pages.",
    shout: "Welcome to our demo group shout!",
    icon: "https://tr.rbxcdn.com/default.png",
    banner: "https://tr.rbxcdn.com/default.png",
    url: "https://www.roblox.com/groups/36086667"
  };

  // Populate group info
  document.getElementById("groupName").textContent = groupInfo.name;
  document.getElementById("groupDesc").textContent = groupInfo.description;
  document.getElementById("groupShout").textContent = groupInfo.shout;
  document.getElementById("viewGroupBtn").href = groupInfo.url;
  document.getElementById("groupIcon").src = groupInfo.icon;
  document.getElementById("groupBanner").style.backgroundImage = `url(${groupInfo.banner})`;

  // ------------------ Demo members ------------------
  const allMembers = [
    { username: "DemoOwner", role: "Owner", avatar: "https://tr.rbxcdn.com/30DAY-Avatar-Headshot-420x420.png" },
    { username: "DemoAdmin1", role: "Admin", avatar: "https://tr.rbxcdn.com/AvatarHeadshot-150x150.png" },
    { username: "DemoAdmin2", role: "Admin", avatar: "https://tr.rbxcdn.com/AvatarHeadshot-150x150.png" },
    { username: "DemoMember1", role: "Member", avatar: "https://tr.rbxcdn.com/default.png" },
    { username: "DemoMember2", role: "Member", avatar: "https://tr.rbxcdn.com/default.png" },
    { username: "DemoMember3", role: "Member", avatar: "https://tr.rbxcdn.com/default.png" }
  ];

  // ------------------ Display members ------------------
  function displayMembers(members) {
    const memberList = document.getElementById("memberList");
    memberList.innerHTML = "";
    if (!members.length) {
      memberList.innerHTML = "<p>No members found.</p>";
      return;
    }
    members.forEach(member => {
      const card = document.createElement("div");
      card.classList.add("member-card");
      card.innerHTML = `
        <img src="${member.avatar}" alt="${member.username}" />
        <h4>${member.username}</h4>
        <p>${member.role}</p>
      `;
      memberList.appendChild(card);
    });
  }

  // ------------------ Role filter ------------------
  const roleFilter = document.getElementById("roleFilter");
  roleFilter.innerHTML = '<option value="all">All Roles</option>';
  [...new Set(allMembers.map(m => m.role))].forEach(role => {
    const opt = document.createElement("option");
    opt.value = role;
    opt.textContent = role;
    roleFilter.appendChild(opt);
  });

  function applyFilters() {
    const search = document.getElementById("searchBox").value.toLowerCase();
    const role = document.getElementById("roleFilter").value;
    const filtered = allMembers.filter(m =>
      (role === "all" || m.role === role) &&
      m.username.toLowerCase().includes(search)
    );
    displayMembers(filtered);
  }

  document.getElementById("searchBox").addEventListener("input", applyFilters);
  document.getElementById("roleFilter").addEventListener("change", applyFilters);

  // ------------------ Dark mode ------------------
  const themeToggle = document.getElementById("themeToggle");
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  });

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
  }

  // ------------------ Collapsibles ------------------
  document.querySelectorAll(".collapse-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const content = btn.nextElementSibling;
      btn.classList.toggle("active");
      content.classList.toggle("open");
    });
  });

  // ------------------ Init ------------------
  displayMembers(allMembers);
});
