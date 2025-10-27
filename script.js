const groupId = "36086667";
const corsProxy = "https://corsproxy.io/?";

async function loadGroupData() {
  try {
    const res = await fetch(`${corsProxy}https://groups.roblox.com/v1/groups/${groupId}`);
    const data = await res.json();

    document.getElementById("groupName").textContent = data.name;
    document.getElementById("groupDesc").textContent = data.description;

    if (data.shout && data.shout.body) {
      document.getElementById("groupShout").textContent = data.shout.body;
    } else {
      document.getElementById("groupShout").textContent = "No group shout at the moment.";
    }

    loadMembers(); // Load members after group info
  } catch (err) {
    document.getElementById("groupName").textContent = "Error loading group data";
    console.error("Failed to fetch group info:", err);
  }
}

async function loadMembers() {
  const memberList = document.getElementById("memberList");
  memberList.innerHTML = "<p>Loading members...</p>";

  try {
    // Get group roles first
    const rolesRes = await fetch(`${corsProxy}https://groups.roblox.com/v1/groups/${groupId}/roles`);
    const rolesData = await rolesRes.json();

    const members = [];

    // Loop through each role and get members
    for (const role of rolesData.roles) {
      const roleRes = await fetch(`${corsProxy}https://groups.roblox.com/v1/groups/${groupId}/roles/${role.id}/users?limit=5`);
      const roleData = await roleRes.json();

      roleData.data.forEach(user => {
        members.push({
          username: user.username,
          userId: user.userId,
          roleName: role.name
        });
      });
    }

    // Display members
    memberList.innerHTML = "";
    for (const member of members) {
      const thumbRes = await fetch(`${corsProxy}https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${member.userId}&size=100x100&format=Png&isCircular=true`);
      const thumbData = await thumbRes.json();
      const avatar = thumbData.data[0].imageUrl;

      const card = document.createElement("div");
      card.classList.add("member-card");
      card.innerHTML = `
        <img src="${avatar}" alt="${member.username}" />
        <h4>${member.username}</h4>
        <p>${member.roleName}</p>
      `;
      memberList.appendChild(card);
    }

  } catch (err) {
    console.error("Error loading members:", err);
    memberList.innerHTML = "<p>Failed to load members.</p>";
  }
}

loadGroupData();
