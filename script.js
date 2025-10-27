const groupId = "36086667";

async function loadGroupData() {
  const res = await fetch(`https://groups.roblox.com/v1/groups/${groupId}`);
  const data = await res.json();

  document.getElementById("groupName").textContent = data.name;
  document.getElementById("groupDesc").textContent = data.description;
  
  // Fetch the shout
  if (data.shout) {
    document.getElementById("groupShout").textContent = data.shout.body;
  } else {
    document.getElementById("groupShout").textContent = "No shout currently.";
  }
}

loadGroupData();
