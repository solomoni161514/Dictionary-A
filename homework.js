const servers = {
    facebook: [{ username: "turbo-booster", isOnline: false }],
    discord: [
      { username: "mailbox_2", isOnline: true },
      { username: "Leanne", isOnline: false }
    ],
    twitter: [
      { username: "panda_321", isOnline: true },
      { username: "motor_bike5", isOnline: true }
    ],
    instagram: [
      { username: "goldenapple", isOnline: false },
      { username: "violin_91", isOnline: true },
      { username: "hillsam", isOnline: true },
      { username: "monosurfer", isOnline: true }
    ]
  }


const getText = (users) => {
    const onlineUsers = [];
    for (let i = 0; i < users.length; i++) {
        if (users[i].isOnline === true) {
            onlineUsers.push(users[i].username);
        }
    }
    const count = onlineUsers.length;

    if (count === 0) {
        return "No one online";
      } else if (count === 1) {
        return `${onlineUsers[0]} online`;
      } else if (count === 2) {
        return `${onlineUsers[0]} and ${onlineUsers[1]} online`;
      } else {
        const remaining = count - 2;
        return `${onlineUsers[0]}, ${onlineUsers[1]} and ${remaining} more online`;
      }
    }

console.log("User status:");
console.log("FACEBOOK:", getStatusText(servers.facebook));
console.log("DISCORD:", getStatusText(servers.discord));
console.log("TWITTER:", getStatusText(servers.twitter));
console.log("INSTAGRAM:", getStatusText(servers.instagram));


//მას ვერ გავასწორე ბოლომდე