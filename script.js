const groupId = "36086667";

async function loadGroupData() {
  try {
    const res = await fetch(`https://groups.roblox.com/v1/groups/${groupId}`);
    const data = await res.json();

    document.getElementById("groupName").textContent = data.name;
    document.getElementById("groupDesc").textContent = data.description;

    if (data.shout && data.shout.body) {
      document.getElementById("groupShout").textContent = data.shout.body;
    } else {
      document.getElementById("groupShout").textContent = "No group shout at the moment.";
    }
  } catch (err) {
    document.getElementById("groupName").textContent = "Error loading group data";
    console.error("Failed to fetch group info:", err);
  }
}

loadGroupData();

