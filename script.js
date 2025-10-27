document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Script connected!");

  const groupId = "36086667";

  let allMembers = [];

  // ------------------ Demo members ------------------
  const demoMembers = [
    { username: "DemoUser1", role: "Owner", avatar: "https://tr.rbxcdn.com/30DAY-Avatar-Headshot-420x420.png" },
    { username: "DemoUser2", role: "Admin", avatar: "https://tr.rbxcdn.com/AvatarHeadshot-150x150.png" },
    { username: "DemoUser3", role: "Member", avatar: "https://tr.rbxcdn.com/default.png" },
    { username: "DemoUser4", role: "Member", avatar: "https://tr.rbxcdn.com/AvatarHeadshot-150x150.png" },
    { username: "DemoUser5", role: "Admin", avatar: "https://tr.rbxcdn.com/30DAY-Avatar-Headshot-420x420.png" },
  ];

  allMembers = demoMembers;

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

  // ------------------ Filters ------------------
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

  // ------------------ Load group info ------------------
  async function loadGroupInfo() {
    const groupNameEl = document.getElementById("groupName");
    const groupDescEl = document.getElementById("groupDesc");
    const groupShoutEl = document.getElementById("groupShout");
    const groupIconEl = document.getElementById("groupIcon");
    const groupBannerEl = document.getElementById("groupBanner");
    const viewGroupBtn = document.getElementById("viewGroupBtn");

    try {
      const res = await fetch(`https://groups.roblox.com/v1/groups/${groupId}`);
      const data = await res.json();

      groupNameEl.textContent = data.name;
      groupDescEl.textContent = data.description;
      groupShoutEl.textContent = data.shout?.body || "No group shout at the moment.";
      viewGroupBtn.href = `https://www.roblox.com/groups/${groupId}`;

      // Load icon
      const iconRes = await fetch(`https://thumbnails.roblox.com/v1/groups/icons?groupIds=${groupId}&size=150x150&format=Png`);
      const iconData = await iconRes.json();
      const iconUrl = iconData.data?.[0]?.imageUrl;
      if (iconUrl) {
        groupIconEl.src = iconUrl;
        groupBannerEl.style.backgroundImage = `url(${iconUrl})`;
      }
    } catch (err) {
      console.error("Error loading group info:", err);
      groupNameEl.textContent = "Error loading group info";
      groupDescEl.textContent = "";
      groupShoutEl.textContent = "";
    }
  }

  // ------------------ Init ------------------
  displayMembers(allMembers);
  loadGroupInfo();
});
