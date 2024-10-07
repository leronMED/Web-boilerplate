let allUsers = [];
let allFormattedUsers = [];
let currentUsers = [];
let tbodyMain;
let currentUsersTable = [];

const usersPerPage = 10;
const initialUsers = 50;
let currentPage = 1;

let totalPages = 1;
const courses = [
  "Mathematics",
  "Physics",
  "English",
  "Computer Science",
  "Dancing",
  "Chess",
  "Biology",
  "Chemistry",
  "Law",
  "Art",
  "Medicine",
  "Statistics",
];

const getRandomCourse = () =>
  courses[Math.floor(Math.random() * courses.length)];

const editUser = (user) => {
  const generatedId = () => {
    return `${user.name?.first}-${user.name?.last}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  };

  return {
    id:
      user.id && user.id.name && user.id.value
        ? `${user.id.name}${user.id.value}`
        : generatedId(),
    gender: user.gender,
    title: user.name?.title || null,
    full_name: `${user.name?.first} ${user.name?.last}`,
    city: user.location?.city || null,
    state: user.location?.state || null,
    country: user.location?.country || null,
    postcode: user.location?.postcode || null,
    coordinates: user.location?.coordinates || {},
    timezone: user.location?.timezone || {},
    email: user.email,
    b_date: user.dob?.date || null,
    age: user.dob?.age || null,
    phone: user.phone || null,
    picture_large: user.picture?.large || null,
    picture_thumbnail: user.picture?.thumbnail || null,
    favorite: null,
    course: getRandomCourse(),
    bg_color: null,
    note: null,
  };
};
const fetchUsers = async (results = 50, page = 1) => {
  try {
    const response = await fetch(
      `https://randomuser.me/api/?results=${results}&page=${page}`
    );
    const data = await response.json();
    const newUsers = data.results.map(editUser);

    allFormattedUsers = [...allFormattedUsers, ...newUsers];
    totalPages = Math.ceil(allFormattedUsers.length / usersPerPage);
    renderPagination();
    currentUsers = filterUsers(allFormattedUsers, filters);
    currentUsersTable = filterUsersForPage(allFormattedUsers, currentPage);
    displayUsers(currentUsers);
    const tbody = document.getElementsByTagName("tbody")[0];
    if (currentPage === 1) {
      createSortableTable(currentUsersTable);
    } else {
      updateTableBody(tbody, currentUsersTable);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};
function createSortableTable(currentUsers) {
  const table = document.createElement("table");

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const headers = [
    { text: "Name", field: "full_name" },
    { text: "Speciality", field: "course" },
    { text: "Age", field: "age" },
    { text: "Birthday", field: "b_date" },
    { text: "Nationality", field: "country" },
  ];

  headers.forEach((header) => {
    const th = document.createElement("th");
    th.innerHTML = `
            <div class="flex">
                ${header.text}
                <div class="container-svg-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="rgb(94, 183, 184)" class="size-6" width="1.5rem">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3" />
                    </svg>
                </div>
            </div>
            <div class="th-hover-line"></div>
        `;

    let ascending = true;
    th.addEventListener("click", () => {
      currentUsersTable = sortArray(
        filterUsersForPage(allFormattedUsers, currentPage),
        header.field,
        ascending
      );
      updateTableBody(tbody, currentUsersTable);
      ascending = !ascending;
    });

    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  updateTableBody(tbody, currentUsers);
  table.appendChild(tbody);

  document.querySelector(".container-table").appendChild(table);
}

function filterUsersForPage(users, page) {
  const start = (page - 1) * usersPerPage;
  const end = start + usersPerPage;
  return users.slice(start, end);
}

const nextButton = document.createElement("button");
nextButton.innerText = "Next";
nextButton.className = "next-button";
nextButton.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    const tbody = document.getElementsByTagName("tbody")[0];
    currentUsers = filterUsersForPage(allFormattedUsers, currentPage);
    updateTableBody(tbody, currentUsers);
    renderPagination();
  } else {
    currentPage++;
    fetchUsers(usersPerPage, currentPage);
  }
});

function renderPagination() {
  const paginationContainer = document.querySelector(".list-number");
  paginationContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const pageLink = document.createElement("a");

    pageLink.innerText = i;
    if (i === currentPage) {
      pageLink.classList.add("blue-color");
    }

    pageLink.addEventListener("click", () => {
      currentPage = i;
      currentUsers = filterUsersForPage(allFormattedUsers, currentPage);
      updateTableBody(document.getElementsByTagName("tbody")[0], currentUsers);
      renderPagination();
    });

    paginationContainer.appendChild(pageLink);
  }

  if (currentPage < totalPages) {
    const nextButton = document.createElement("a");

    nextButton.innerText = "Next";
    nextButton.addEventListener("click", () => {
      currentPage++;
      currentUsers = filterUsersForPage(allFormattedUsers, currentPage);
      updateTableBody(document.getElementsByTagName("tbody")[0], currentUsers);
      renderPagination(); // Оновлюємо пагінацію
    });
    paginationContainer.appendChild(nextButton);
  }
}

function updateTableBody(tbody, users) {
  tbody.innerHTML = "";

  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.full_name}</td>
      <td>${user.course}</td>
      <td>${user.age}</td>
      <td>${new Date(user.b_date).toLocaleDateString()}</td>
      <td>${user.country}</td>
    `;
    tbody.appendChild(row);
  });
}

fetchUsers(initialUsers, currentPage);

function sortArray(array, sortField, ascending = true) {
  return array.sort((a, b) => {
    const valueA = a[sortField];
    const valueB = b[sortField];

    if (sortField === "b_day") {
      const dateA = new Date(valueA);
      const dateB = new Date(valueB);
      return ascending ? dateA - dateB : dateB - dateA;
    }

    const isNumericA = !isNaN(valueA);
    const isNumericB = !isNaN(valueB);

    if (isNumericA && isNumericB) {
      return ascending
        ? Number(valueA) - Number(valueB)
        : Number(valueB) - Number(valueA);
    }
    const strA = String(valueA || "").toLowerCase();
    const strB = String(valueB || "").toLowerCase();
    if (strA < strB) {
      return ascending ? -1 : 1;
    }
    if (strA > strB) return ascending ? 1 : -1;
    return 0;
  });
}

function findAllObjectsByParam(users, searchParam, searchValue) {
  return users.filter((user) => {
    if (user[searchParam] === undefined) return false;

    const fieldValue = user[searchParam];
    if (Number.isInteger(fieldValue)) {
      return searchValue == fieldValue;
    } else {
      return fieldValue.toLowerCase().includes(searchValue.toLowerCase());
    }
  });
}

const container = document.getElementsByClassName(
  "container-avatar-teachers"
)[0];

function displayUsers(users) {
  container.innerHTML = "";

  users.forEach((user) => {
    console.log(user);
    const avatarDiv = document.createElement("div");
    avatarDiv.className = "container-avatar";

    const photoDiv = document.createElement("div");
    photoDiv.className = "container-avatar-photo";
    const img = document.createElement("img");
    img.className = "avatar-photo";
    img.src = user.picture_large || "/img/avatars/default.jpg";
    img.alt = user.full_name;
    photoDiv.appendChild(img);

    const nameDiv = document.createElement("div");
    nameDiv.className = "avatar-name";
    nameDiv.innerHTML = user.full_name;

    const majorityDiv = document.createElement("div");
    majorityDiv.className = "avatar-majority";
    majorityDiv.innerHTML = user.state || "";

    const countryDiv = document.createElement("div");
    countryDiv.className = "avatar-country";
    countryDiv.innerHTML = user.city;

    avatarDiv.appendChild(photoDiv);
    avatarDiv.appendChild(nameDiv);
    avatarDiv.appendChild(majorityDiv);
    avatarDiv.appendChild(countryDiv);

    container.appendChild(avatarDiv);

    avatarDiv.addEventListener("click", () => {
      const teacherCard = document.createElement("div");
      teacherCard.classList.add("container-card-teacher");

      const containerTeacherInfo = document.createElement("div");
      containerTeacherInfo.classList.add(
        "container-teacher-info",
        "flex",
        "flex-space-between"
      );

      const teacherInfo = document.createElement("div");
      teacherInfo.classList.add("teacher-info");
      teacherInfo.innerText = "Teacher info";

      const svgTeacherInfo = document.createElement("div");
      svgTeacherInfo.classList.add("svg-teacher-info");
      svgTeacherInfo.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="White" class="size-6" width="24px" height="24px">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
      `;
      svgTeacherInfo.addEventListener("click", () => {
        if (teacherCard) {
          teacherCard.style.display = "none";
        }

        if (containerMain) {
          containerMain.style.backgroundColor = "";
          containerMain.style.filter = "";
        }
      });

      containerTeacherInfo.appendChild(teacherInfo);
      containerTeacherInfo.appendChild(svgTeacherInfo);
      teacherCard.appendChild(containerTeacherInfo);

      const flexContainer = document.createElement("div");
      flexContainer.classList.add("flex");
      flexContainer.style.height = "252px";

      const imgContainer = document.createElement("div");
      const teacherInfoPhoto = document.createElement("img");
      teacherInfoPhoto.classList.add("teacher-info-photo");
      teacherInfoPhoto.src = user.picture_large || "/img/avatars/default.jpg";
      teacherInfoPhoto.alt = "Photo of teacher";
      imgContainer.appendChild(teacherInfoPhoto);

      const infoContainer = document.createElement("div");
      infoContainer.style.width = "27rem";

      const teacherInfoName = document.createElement("div");
      teacherInfoName.classList.add("teacher-info-name");
      teacherInfoName.innerText = user.full_name;

      const teacherInfoMajority = document.createElement("div");
      teacherInfoMajority.classList.add("teacher-info-majority");
      teacherInfoMajority.innerText = user.state || "";

      const teacherInfoCountry = document.createElement("div");
      teacherInfoCountry.classList.add("teacher-info-country");
      teacherInfoCountry.innerText = user.city;

      const teacherInfoAge = document.createElement("div");
      teacherInfoAge.classList.add("teacher-info-age");
      teacherInfoAge.innerText = user.age ? `${user.age}, ${user.gender}` : "";

      const teacherInfoMail = document.createElement("div");
      teacherInfoMail.classList.add("teacher-info-mail");
      teacherInfoMail.innerText = user.email || "";

      const teacherInfoNumber = document.createElement("div");
      teacherInfoNumber.classList.add("teacher-info-number");
      teacherInfoNumber.innerText = user.phone || "";

      infoContainer.appendChild(teacherInfoName);
      infoContainer.appendChild(teacherInfoMajority);
      infoContainer.appendChild(teacherInfoCountry);
      infoContainer.appendChild(teacherInfoAge);
      infoContainer.appendChild(teacherInfoMail);
      infoContainer.appendChild(teacherInfoNumber);

      flexContainer.appendChild(imgContainer);
      flexContainer.appendChild(infoContainer);

      const starElement = document.createElement("div");
      starElement.classList.add("unfill-star");
      const starId = `star-${user.id}`;
      starElement.id = starId;
      starElement.innerHTML =
        user.favorite === true ? getFilledStarSVG() : getUnfilledStarSVG();

      if (!starElement.hasAttribute("data-listener")) {
        starElement.setAttribute("data-listener", "true");
        starElement.addEventListener("click", () => {
          user.favorite = !user.favorite;
          displayUsersFavorite();
          starElement.innerHTML = user.favorite
            ? getFilledStarSVG()
            : getUnfilledStarSVG();
        });
      }

      flexContainer.appendChild(starElement);

      teacherCard.appendChild(flexContainer);

      const teacherInfoLorem = document.createElement("div");
      teacherInfoLorem.classList.add("teacher-info-lorem");
      teacherInfoLorem.innerText =
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cum deleniti sint tenetur iusto vitae impedit cumque aut, optio harum illo pariatur mollitia excepturi assumenda. Perferendis quisquam officia error ipsam porro.";
      teacherCard.appendChild(teacherInfoLorem);

      const teacherInfoToggle = document.createElement("a");
      teacherInfoToggle.classList.add("teacher-info-toggle");
      teacherInfoToggle.href = "#";
      teacherInfoToggle.innerText = "toggle map";
      teacherCard.appendChild(teacherInfoToggle);

      document.body.appendChild(teacherCard);

      const containerMain = document.querySelector(".container");

      teacherCard.style.display = "block";
      containerMain.style.backgroundColor = "rgba(212, 212, 212, 0.692)";
      containerMain.style.filter = "blur(3px)";
    });
  });
  const nextButton = document.createElement("button");
  nextButton.innerText = "Next";
  nextButton.className = "next-button";
  nextButton.addEventListener("click", () => {
    currentPage++;
    fetchUsers(usersPerPage, currentPage);
  });

  container.appendChild(nextButton);
}

function getFilledStarSVG() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve">
      <defs>
      </defs>
      <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(0.3 0.3)">
        <path d="M 45.002 75.502 c 2.862 0 5.72 0.684 8.326 2.051 l 19.485 10.243 l -3.721 -21.678 c -1.002 -5.815 0.926 -11.753 5.164 -15.877 L 90 34.895 l -21.768 -3.161 c -5.838 -0.85 -10.884 -4.514 -13.499 -9.806 L 44.998 2.205 l -9.73 19.717 c -2.615 5.292 -7.661 8.962 -13.499 9.811 L 0 34.895 L 15.749 50.25 c 4.224 4.111 6.156 10.044 5.16 15.863 l -3.721 21.682 l 19.466 -10.238 C 39.268 76.19 42.135 75.502 45.002 75.502 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,207,100); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
      </g>
    </svg>
  `;
}

function getUnfilledStarSVG() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 117.42">
            <path
              d="M66.71 3.55L81.1 37.26l36.58 3.28v-.01c1.55.13 2.91.89 3.85 2.01a5.663 5.663 0 011.32 4.13v.01a5.673 5.673 0 01-1.69 3.57c-.12.13-.25.25-.39.36L93.25 74.64l8.19 35.83c.35 1.53.05 3.06-.73 4.29a5.652 5.652 0 01-3.54 2.52l-.14.03c-.71.14-1.43.15-2.12.02v.01c-.75-.13-1.47-.42-2.11-.84l-.05-.03-31.3-18.71-31.55 18.86a5.664 5.664 0 01-7.79-1.96c-.38-.64-.62-1.33-.73-2.02-.1-.63-.09-1.27.02-1.89.02-.13.04-.27.08-.4l8.16-35.7c-9.24-8.07-18.74-16.1-27.83-24.3l-.08-.08a5.64 5.64 0 01-1.72-3.7c-.1-1.45.36-2.93 1.4-4.12l.12-.13.08-.08a5.668 5.668 0 013.77-1.72h.06l36.34-3.26 14.44-33.8c.61-1.44 1.76-2.5 3.11-3.05 1.35-.54 2.9-.57 4.34.04.69.29 1.3.71 1.8 1.22.53.53.94 1.15 1.22 1.82l.02.06zm10.19 37.2L61.85 5.51a.42.42 0 00-.09-.14.42.42 0 00-.14-.09.427.427 0 00-.35 0c-.1.04-.19.12-.24.24L45.98 40.75c-.37.86-1.18 1.49-2.18 1.58l-37.9 3.4c-.08.01-.16.02-.24.02-.06 0-.13.02-.18.05-.03.01-.05.03-.07.05l-.1.12c-.05.08-.07.17-.06.26.01.09.04.18.09.25.06.05.13.11.19.17l28.63 25c.77.61 1.17 1.62.94 2.65l-8.51 37.22-.03.14c-.01.06-.02.12-.01.17a.454.454 0 00.33.36c.12.03.24.02.34-.04l32.85-19.64c.8-.5 1.85-.54 2.72-.02L95.43 112c.08.04.16.09.24.14.05.03.1.05.16.06v.01c.04.01.09.01.14 0l.04-.01c.12-.03.22-.1.28-.2.06-.09.08-.21.05-.33L87.8 74.28a2.6 2.6 0 01.83-2.55l28.86-25.2c.04-.03.07-.08.1-.13.02-.04.03-.1.04-.17a.497.497 0 00-.09-.33.48.48 0 00-.3-.15v-.01c-.01 0-.03 0-.03-.01l-37.97-3.41c-1-.01-1.93-.6-2.34-1.57z"
              fill="#ffcf00"
            />
          </svg>
  `;
}

function filterUsers(users, filters) {
  return users.filter((user) => {
    const countryMatch =
      filters.country === "-" || user.country === filters.country;

    const ageMatch =
      filters.age === "all" ||
      (filters.age === "31+"
        ? user.age >= 31
        : user.age >= 18 && user.age <= 31);

    console.log(filters.gender);
    const genderMatch =
      filters.gender === undefined ||
      filters.gender === "All" ||
      user.gender === filters.gender;

    const favoriteMatch = filters.favorite ? user.favorite : true;

    const photoMatch = filters.photo ? user.picture_large : true;

    return (
      countryMatch && ageMatch && genderMatch && favoriteMatch && photoMatch
    );
  });
}

let filters = {
  country: "-",
  age: "all",
  gender: undefined,
  favorite: false,
  photo: false,
};

displayUsers(currentUsers);

document.getElementById("age").addEventListener("change", function (event) {
  filters.age = event.target.value;
  currentUsers = filterUsers(allFormattedUsers, filters);
  totalPages = Math.ceil(currentUsers.length / usersPerPage);
  currentPage = 1;
  renderPagination();
  currentUsersTable = filterUsersForPage(currentUsers, currentPage);
  const tbody = document.getElementsByTagName("tbody")[0];
  displayUsers(currentUsers);
  updateTableBody(tbody, currentUsersTable);
});

document.getElementById("region").addEventListener("change", function (event) {
  filters.country = event.target.value;
  currentUsers = filterUsers(allFormattedUsers, filters);
  totalPages = Math.ceil(currentUsers.length / usersPerPage);
  currentPage = 1;
  renderPagination();
  currentUsersTable = filterUsersForPage(currentUsers, currentPage);
  const tbody = document.getElementsByTagName("tbody")[0];
  displayUsers(currentUsers);
  updateTableBody(tbody, currentUsersTable);
});

document.getElementById("sex").addEventListener("change", function (event) {
  filters.gender = event.target.value;
  currentUsers = filterUsers(allFormattedUsers, filters);
  totalPages = Math.ceil(currentUsers.length / usersPerPage);
  currentPage = 1;
  renderPagination();
  currentUsersTable = filterUsersForPage(currentUsers, currentPage);
  const tbody = document.getElementsByTagName("tbody")[0];
  displayUsers(currentUsers);
  updateTableBody(tbody, currentUsersTable);
});

document
  .getElementById("with-photo")
  .addEventListener("change", function (event) {
    filters.photo = event.target.checked;
    currentUsers = filterUsers(allFormattedUsers, filters);
    totalPages = Math.ceil(currentUsers.length / usersPerPage);
    currentPage = 1;
    renderPagination();
    currentUsersTable = filterUsersForPage(currentUsers, currentPage);
    const tbody = document.getElementsByTagName("tbody")[0];
    displayUsers(currentUsers);
    updateTableBody(tbody, currentUsersTable);
  });

document
  .getElementById("favorites")
  .addEventListener("change", function (event) {
    filters.favorite = event.target.checked;
    currentUsers = filterUsers(allFormattedUsers, filters);
    totalPages = Math.ceil(currentUsers.length / usersPerPage);
    currentPage = 1;
    renderPagination();
    currentUsersTable = filterUsersForPage(currentUsers, currentPage);
    const tbody = document.getElementsByTagName("tbody")[0];
    displayUsers(currentUsers);
    updateTableBody(tbody, currentUsersTable);
  });

function searchUsers(users, query) {
  const lowerQuery = query.toLowerCase();
  return users.filter((user) => {
    return (
      user.full_name.toLowerCase().includes(lowerQuery) ||
      (user.note && user.note.toLowerCase().includes(lowerQuery)) ||
      String(user.age).includes(lowerQuery)
    );
  });
}

document.querySelector(".btn-search").addEventListener("click", () => {
  const query = document.querySelector(".input-search").value;
  const filteredUsers = searchUsers(allFormattedUsers, query);
  displayUsers(filteredUsers);
});

const addTeacherButton = document.querySelector(".btn-add-teacher");
const teacherForm = document.querySelector(".container-teacher-form");

addTeacherButton.addEventListener("click", (e) => {
  e.preventDefault();
  teacherForm.classList.toggle("hidden");
  const container = document.querySelector(".container");

  if (!teacherForm.classList.contains("hidden")) {
    container.style.backgroundColor = "rgba(212, 212, 212, 0.692)";
    container.style.filter = "blur(3px)";
  } else {
    container.style.backgroundColor = "";
    container.style.filter = "";
  }
});

const form = teacherForm.querySelector("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = {
    full_name: form.querySelector("#name").value,
    gender: form.querySelector('input[name="sex"]:checked')?.value || "",
    age: calculateAge(form.querySelector("#date").value), // Рахуємо вік
    state: form.querySelector("#country").value,
    city: form.querySelector("#city").value,
    email: form.querySelector("#email").value,
    phone: form.querySelector("#phone").value,
  };

  try {
    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const newUser = await response.json();
    console.log(newUser);
    allFormattedUsers.push(newUser);
    tbodyMain = document.getElementsByTagName("tbody")[0];

    updateTableBody(tbodyMain, allFormattedUsers);
    displayUsers(allFormattedUsers);

    console.log("User added:", newUser);

    form.reset();
    const container = document.querySelector(".container");
    teacherForm.classList.add("hidden");
    container.style.backgroundColor = "";
    container.style.filter = "";
    teacherForm.classList.add("hidden");
  } catch (error) {
    console.error("Error adding user:", error);
  }
});

function calculateAge(birthDate) {
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDifference = today.getMonth() - birthDateObj.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDateObj.getDate())
  ) {
    age--;
  }
  return age;
}

let currentStartIndex = 0;
const maxVisibleAvatars = 5;

function displayUsersFavorite() {
  const container = document.querySelector(".list-avatars");
  container.innerHTML = "";

  const users = allFormattedUsers.filter((user) => user.favorite);

  const visibleUsers = users.slice(
    currentStartIndex,
    currentStartIndex + maxVisibleAvatars
  );

  visibleUsers.forEach((user) => {
    const avatarDiv = document.createElement("div");
    avatarDiv.className = "container-avatar";

    const photoDiv = document.createElement("div");
    photoDiv.className = "container-avatar-photo";
    const img = document.createElement("img");
    img.className = "avatar-photo";
    img.src = user.picture_large || "/img/avatars/default.jpg";
    img.alt = user.full_name;
    photoDiv.appendChild(img);

    const nameDiv = document.createElement("div");
    nameDiv.className = "avatar-name";
    nameDiv.innerHTML = user.full_name;

    const majorityDiv = document.createElement("div");
    majorityDiv.className = "avatar-majority";
    majorityDiv.innerHTML = user.state || "";

    const countryDiv = document.createElement("div");
    countryDiv.className = "avatar-country";
    countryDiv.innerHTML = user.city;

    avatarDiv.appendChild(photoDiv);
    avatarDiv.appendChild(nameDiv);
    avatarDiv.appendChild(majorityDiv);
    avatarDiv.appendChild(countryDiv);

    container.appendChild(avatarDiv);
  });

  document.querySelector(".arrow-left").style.display =
    currentStartIndex === 0 ? "none" : "block";
  document.querySelector(".arrow-right").style.display =
    currentStartIndex + maxVisibleAvatars >= users.length ? "none" : "block";
}

function scrollLeft() {
  if (currentStartIndex > 0) {
    currentStartIndex -= 1;
    displayUsersFavorite();
  }
}

function scrollRight() {
  const users = allFormattedUsers.filter((user) => user.favorite);
  if (currentStartIndex + maxVisibleAvatars < users.length) {
    currentStartIndex += 1;
    displayUsersFavorite();
  }
}

document.querySelector(".arrow-left").addEventListener("click", scrollLeft);
document.querySelector(".arrow-right").addEventListener("click", scrollRight);

displayUsersFavorite();
