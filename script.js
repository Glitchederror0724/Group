document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Script connected!");

  const groupId = "36086667";
  const proxies = [
    url => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    url => `https://corsproxy.io/?${encodeURIComponent(url)}`
  ];

  let allMembers = [];
  let allRoles = [];

  async function fetchViaProxy(url) {
    for (const build of proxies) {
      try {
        const res = await fetch(build(url));
        if (!res.ok) continue;
        const data = await res.json();
        if (data.contents) return JSON.parse(data.contents);
        return data;
      } catch (e) {
        console.warn("Proxy failed, trying next:", e);
      }
    }
    throw new Error("All proxies failed.");
  }

  async function loadGroupData() {
    toggleLoader(true);
    try {
      const data = await fetchViaProxy(`https://groups.roblox.com/v1/groups/${groupId}`);
      document.getElementById("groupName").textContent = data.name;
      document.getElementById("groupDesc").textContent = data.description;
      document.getElementById("viewGroupBtn").href = `https://www.roblox.com/groups/${groupId}`;
      document.getElementById("groupShout").textContent = data.shout?.body || "No group shout at the moment.";

      const iconData = await fetchViaProxy(`https://thumbnails.roblox.com/v1/groups/icons?groupIds=${groupId}&size=150x150&format=Png`);
      const iconUrl = iconData.data?.[0]?.imageUrl;
      if (iconUrl) {
        document.getElementById("groupIcon").src = iconUrl;
        document.getElementById("groupBanner").style.backgroundImage = `url(${iconUrl})`;
      }

      await loadMembers();
    } catch (err) {
      document.getElementById("groupName").textContent = "Error loading group data";
      console.error("Failed to fetch group info:", err);
    }
    toggleLoader(false);
  }

  // ------------------ Member loader ------------------
  async function loadMembers() {
    const memberList = document.getElementById("memberList");
    memberList.innerHTML = "<p>Loading members...</p>";

    try {
      // Step 1: Get roles
      const rolesData = await fetchViaProxy(`https://groups.roblox.com/v1/groups/${groupId}/roles`);
      allRoles = rolesData.roles;
      const roleFilter = document.getElementById("roleFilter");
      roleFilter.innerHTML = '<option value="all">All Roles</option>';
      allRoles.forEach(role => {
        const opt = document.createElement("option");
        opt.value = role.name;
        opt.textContent = role.name;
        roleFilter.appendChild(opt);
      });

      // Step 2: Get members (new endpoint, first 100)
      const membersData = await fetchViaProxy(`https://groups.roblox.com/v1/groups/${groupId}/users?limit=100`);
      if (!membersData.data || !membersData.data.length) throw new Error("No members returned.");

      const members = membersData.data.map(u => ({
        username: u.user.username,
        userId: u.user.userId,
        role: allRoles.find(r => r.id === u.role.id)?.name || "Member"
      }));

      // Step 3: Load avatars
      const ids = members.map(m => m.userId).join(",");
      const thumbs = await fetchViaProxy(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${ids}&size=100x100&format=Png&isCircular=true`);
      const thumbMap = {};
      thumbs.data.forEach(t => (thumbMap[t.targetId] = t.imageUrl));

      allMembers = members.map(m => ({ ...m, avatar: thumbMap[m.userId] }));
      displayMembers(allMembers);
    } catch (err) {
      console.warn("⚠️ Member API blocked or failed:", err);

      // Fallback demo members
      memberList.innerHTML = "";
      const demo = [
        { username: "DemoUser1", role: "Admin", avatar: "https://tr.rbxcdn.com/30DAY-Avatar-Headshot-420x420.png" },
        { username: "DemoUser2", role: "Member", avatar: "https://tr.rbxcdn.com/AvatarHeadshot-150x150.png" },
        { username: "DemoUser3", role: "Owner", avatar: "https://tr.rbxcdn.com/default.png" }
      ];
      displayMembers(demo);
    }
  }

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

  // ------------------ Theme toggle ------------------
  const themeToggle = document.getElementById("themeToggle");
  themeToggle.addEventListener("click", toggleTheme);

  function toggleTheme() {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }

  function loadTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.body.classList.add("dark");
      themeToggle.textContent = "☀️";
    }
  }

  // ------------------ Loader ------------------
  function toggleLoader(show) {
    document.getElementById("loader").style.display = show ? "block" : "none";
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
  loadTheme();
  loadGroupData();
});
