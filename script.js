document.addEventListener("DOMContentLoaded", () => {
  // ----- DATA FOR PLAYLIST -----
  const playlistData = [
    {
      id: "intro",
      title: "Module Overview: Getting Started",
      duration: "5:23",
      description:
        "This short overview introduces the module goals, grading breakdown, and how to use the playlist, comments, and quiz features in this learning environment.",
    },
    {
      id: "lecture1",
      title: "Lecture 1: Navigating the Interface",
      duration: "12:10",
      description:
        "Walkthrough of the main dashboard, including how to access your courses, find modules, and open videos from the playlist on the left.",
    },
    {
      id: "lecture2",
      title: "Lecture 2: Using Comments Effectively",
      duration: "9:48",
      description:
        "Learn how to read and post comments in the side panel while watching a video, and how to follow threads without losing the lecture context.",
    },
    {
      id: "summary",
      title: "Module Summary & Quiz Review",
      duration: "7:31",
      description:
        "A quick recap of key ideas from the module and tips for completing the weekly quiz successfully.",
    },
  ];

  // ----- PLAYLIST RENDERING (Task 2) -----
  const playlistElement = document.getElementById("playlist");
  const videoTitleElement = document.getElementById("video-title");
  const videoDescriptionElement = document.getElementById("video-description");

  function renderPlaylist() {
    playlistData.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "playlist-item";
      li.setAttribute("role", "option");
      li.dataset.id = item.id;

      if (index === 0) {
        li.classList.add("active");
      }

      const title = document.createElement("div");
      title.className = "playlist-item-title";
      title.textContent = item.title;

      const meta = document.createElement("div");
      meta.className = "playlist-item-meta";
      meta.textContent = `Video • ${item.duration}`;

      li.appendChild(title);
      li.appendChild(meta);

      li.addEventListener("click", () => {
        selectVideo(item.id);
      });

      playlistElement.appendChild(li);
    });
  }

  function selectVideo(id) {
    const selected = playlistData.find((v) => v.id === id);
    if (!selected) return;

    // Set active class
    document.querySelectorAll(".playlist-item").forEach((li) => {
      li.classList.toggle("active", li.dataset.id === id);
    });

    // Update video info + description clearly at bottom (Task 4)
    videoTitleElement.textContent = selected.title;
    videoDescriptionElement.textContent = selected.description;
  }

  renderPlaylist();
  selectVideo(playlistData[0].id);

  // ----- COMMENTS SIDE PANEL (Task 3) -----
  const initialComments = [
    {
      author: "Instructor",
      time: "2 min ago",
      text: "Welcome to the module! Start with the overview video in the playlist on the left.",
    },
    {
      author: "Alex",
      time: "10 min ago",
      text: "The comments panel on the right is really helpful to follow questions while watching.",
    },
    {
      author: "Jordan",
      time: "25 min ago",
      text: "Remember, the video description at the bottom summarizes the key points from this lecture.",
    },
  ];

  const commentList = document.getElementById("comment-list");
  const commentForm = document.getElementById("comment-form");
  const commentInput = document.getElementById("comment-input");

  function renderComment(comment) {
    const wrapper = document.createElement("article");
    wrapper.className = "comment";

    const header = document.createElement("div");
    header.className = "comment-header";

    const authorSpan = document.createElement("span");
    authorSpan.className = "comment-author";
    authorSpan.textContent = comment.author;

    const timeSpan = document.createElement("span");
    timeSpan.className = "comment-time";
    timeSpan.textContent = comment.time;

    header.appendChild(authorSpan);
    header.appendChild(timeSpan);

    const body = document.createElement("p");
    body.className = "comment-body";
    body.textContent = comment.text;

    wrapper.appendChild(header);
    wrapper.appendChild(body);

    commentList.appendChild(wrapper);
  }

  initialComments.forEach(renderComment);

  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = commentInput.value.trim();
    if (!text) return;

    const newComment = {
      author: "You",
      time: "Just now",
      text,
    };

    renderComment(newComment);
    commentInput.value = "";
    commentList.scrollTop = commentList.scrollHeight;
  });

  // ----- SIMPLE PLAY BUTTON (visual only) -----
  const playButton = document.getElementById("play-button");
  playButton.addEventListener("click", () => {
    playButton.textContent = "⏸ Pause";
    setTimeout(() => {
      playButton.textContent = "▶ Play";
    }, 1200);
  });

  // ----- TOP NAV TABS: VIDEO VIEW / QUIZ VIEW -----
  const navTabs = document.querySelectorAll(".nav-tab");
  const views = document.querySelectorAll(".view");

  navTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.dataset.view;

      navTabs.forEach((t) => {
        t.classList.toggle("active", t === tab);
        t.setAttribute("aria-pressed", t === tab ? "true" : "false");
      });

      views.forEach((view) => {
        if (view.id === targetId) {
          view.classList.add("active");
          view.removeAttribute("hidden");
        } else {
          view.classList.remove("active");
          view.setAttribute("hidden", "true");
        }
      });
    });
  });

  // ----- QUIZ LOGIC (Task 1: take and submit quiz) -----
  const quizForm = document.getElementById("quiz-form");
  const quizResult = document.getElementById("quiz-result");

  const correctAnswers = {
    q1: "c",
    q2: "b",
    q3: "b",
    q4: "a",
  };

  quizForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let score = 0;
    let total = Object.keys(correctAnswers).length;

    Object.entries(correctAnswers).forEach(([name, correct]) => {
      const selected = quizForm.querySelector(`input[name="${name}"]:checked`);
      if (selected && selected.value === correct) {
        score += 1;
      }
    });

    const percentage = Math.round((score / total) * 100);
    quizResult.textContent = `You scored ${score} out of ${total} (${percentage}%).`;

    quizResult.classList.remove("ok", "low");
    if (percentage >= 75) {
      quizResult.classList.add("ok");
    } else {
      quizResult.classList.add("low");
    });
  });
});
