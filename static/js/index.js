// 统一使用sessionStorage
const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';


// 更新登出功能
function logout() {
    sessionStorage.removeItem('isLoggedIn');
    document.body.style.opacity = '0';
    setTimeout(() => {
        window.location.href = 'homepage.html';
        window.location.reload(true);
    }, 500);
}


const loginLink = document.querySelector('.navbar .nav-item:nth-last-child(3) .nav-link');
loginLink.addEventListener('click', () => {
    window.location.href = 'Modern Login Page.html';
});
// 获取 dropdown-toggle 元素
const dropdownToggle = document.querySelector('.dropdown-toggle');

// 检查元素是否存在
if (dropdownToggle) {
    // 添加 show.bs.dropdown 事件监听器
    dropdownToggle.addEventListener('show.bs.dropdown', () => {
        dropdownToggle.style.transform = 'rotate(180deg)';
    });

    // 添加 hide.bs.dropdown 事件监听器
    dropdownToggle.addEventListener('hide.bs.dropdown', () => {
        dropdownToggle.style.transform = 'rotate(0deg)';
    });
} else {
    console.warn('Dropdown toggle element not found.');
}


document.addEventListener("DOMContentLoaded", function () {
    const dropdowns = document.querySelectorAll(".dropdown");

    dropdowns.forEach(function (dropdown) {
        dropdown.addEventListener("show.bs.dropdown", function () {
            let menu = dropdown.querySelector(".dropdown-menu");
            menu.classList.add("show");
        });

        dropdown.addEventListener("hide.bs.dropdown", function () {
            let menu = dropdown.querySelector(".dropdown-menu");
            menu.classList.remove("show");
        });
    });
});

document.getElementById("searchForm").addEventListener("submit", function (event) {
    var searchInput = document.querySelector("input[name='search']").value.trim();
    if (searchInput === "") {
        event.preventDefault();
        alert("Please enter a keyword to search!");
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector("input[name='search']");
    const suggestions = ["burger", "ramen", "sushi", "pasta", "pizza", "american", "japanese", "italian", "mexican"];

    searchInput.addEventListener("input", function () {
        const inputText = searchInput.value.toLowerCase();
        let suggestionBox = document.getElementById("suggestionBox");
        if (!suggestionBox) {
            suggestionBox = document.createElement("div");
            suggestionBox.id = "suggestionBox";
            suggestionBox.classList.add("autocomplete-suggestions");
            searchInput.parentNode.appendChild(suggestionBox);
        }
        suggestionBox.innerHTML = "";
        if (inputText.length > 0) {
            const filteredSuggestions = suggestions.filter(item => item.includes(inputText));
            filteredSuggestions.forEach(suggestion => {
                let div = document.createElement("div");
                div.classList.add("suggestion-item");
                div.textContent = suggestion;
                div.addEventListener("click", function () {
                    searchInput.value = suggestion;
                    suggestionBox.innerHTML = "";
                });
                suggestionBox.appendChild(div);
            });
        }
    });

    document.addEventListener("click", function (e) {
        if (!searchInput.contains(e.target) && !document.getElementById("suggestionBox").contains(e.target)) {
            document.getElementById("suggestionBox").innerHTML = "";
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector("input[name='search']");
    const suggestions = ["burger", "ramen", "sushi", "pasta", "pizza", "tacos", "curry", "bbq", "salad", "pho", "noodles", "dumplings"];

    searchInput.addEventListener("input", function () {
        const inputText = searchInput.value.toLowerCase();
        let suggestionBox = document.getElementById("suggestionBox");

        if (!suggestionBox) {
            suggestionBox = document.createElement("div");
            suggestionBox.id = "suggestionBox";
            suggestionBox.classList.add("autocomplete-suggestions");
            searchInput.parentNode.appendChild(suggestionBox);
        }

        suggestionBox.innerHTML = "";

        if (inputText.length > 0) {
            const filteredSuggestions = suggestions.filter(item => item.includes(inputText));
            filteredSuggestions.forEach(suggestion => {
                let div = document.createElement("div");
                div.classList.add("suggestion-item");
                div.textContent = suggestion;
                div.addEventListener("click", function () {
                    searchInput.value = suggestion;
                    suggestionBox.innerHTML = "";
                });
                suggestionBox.appendChild(div);
            });
        }
    });

    document.addEventListener("click", function (e) {
        if (!searchInput.contains(e.target) && suggestionBox && !suggestionBox.contains(e.target)) {
            suggestionBox.innerHTML = "";
        }
    });
});


// 替换现有的搜索功能代码
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const suggestionBox = document.getElementById("suggestionBox");
    const suggestions = [
        "Italian", "Japanese", "Mexican", "Chinese",
        "French", "Korean", "Thai", "Indian",
        "Sushi", "Ramen", "Pizza", "Burger",
        "Tacos", "Dim Sum", "Pasta", "Steak",
        "Fine Dining", "Street Food", "Cafe",
        "Vegetarian", "Seafood", "BBQ", "Noodle Shop"
    ];

    searchInput.addEventListener("input", function () {
        const inputText = this.value.trim();
        suggestionBox.innerHTML = "";

        if (inputText.length > 0) { // 修改为输入任意字符即可触发
            // 前缀匹配正则表达式（添加^符号）
            const searchRegex = new RegExp(`^${inputText}`, 'i');
            const filtered = suggestions
                .filter(item => searchRegex.test(item))
                .sort((a, b) => a.localeCompare(b)); // 按字母顺序排序

            filtered.forEach(suggestion => {
                const div = document.createElement("div");
                div.className = "suggestion-item";
                // 仅高亮前缀匹配部分
                div.innerHTML = `<strong>${suggestion.slice(0, inputText.length)}</strong>${suggestion.slice(inputText.length)}`;
                div.addEventListener("click", () => {
                    searchInput.value = suggestion;
                    document.getElementById("searchForm").submit();
                });
                suggestionBox.appendChild(div);
            });
        }
    });

    // 点击页面其他区域关闭建议框
    document.addEventListener("click", function (e) {
        if (!searchInput.contains(e.target) && !suggestionBox.contains(e.target)) {
            suggestionBox.innerHTML = "";
        }
    });

    // 表单提交验证
    document.getElementById("searchForm").addEventListener("submit", function (e) {
        if (searchInput.value.trim() === "") {
            e.preventDefault();
            searchInput.focus();
        }
    });
});