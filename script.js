const groupId = "36086667";

// Use a safe CORS proxy so it works on GitHub Pages
const corsProxy = "https://corsproxy.io/?";

async function loadGroupData() {
  try {
    const response = await fetch(`${corsProxy}https://groups.roblox.com/v1/groups/${groupId}`);
    const data = await response.json();

    document.getElementById("groupName").textContent = data.name;
    document.getElementById("groupDesc").textContent = data.description;

    if (data.shout && data.shout.body) {
      document.getElementById("groupShout").textContent = data.shout.body;
    } else {
      document.getElementById("groupShout").textContent = "No group shout at the moment.";
    }
  } catch (error) {
    document.getElementById("groupName").textContent = "Error loading group data";
    document.getElementById("groupDesc").textContent = "Please try again later.";
    console.error("Failed to fetch group info:", error);
  }
}

loadGroupData();
