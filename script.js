// 应用缓存的颜色主题
function applyColor(color) {
    const body = document.body;
    if (color === "gulf-blue") {
        body.style.background = "linear-gradient(135deg, #26b3e6, #4fc0c8)";
    } else if (color === "unset") {
        body.style.background = "linear-gradient(135deg, #7f42a5, #803ec7)";
    }
    // 缓存颜色选择
    localStorage.setItem("themeColor", color);
}

// 加载缓存的颜色主题
function loadCachedColor() {
    const cachedColor = localStorage.getItem("themeColor");
    if (cachedColor) {
        applyColor(cachedColor);
    } else {
        applyColor("gulf-blue"); // 默认海湾蓝
    }
}

// 搜索内容
function searchContent() {
    const searchInput = document.getElementById("search-input").value.trim().toLowerCase();
    const contentModules = [
        { title: "模块标题1", content: "这是模块1的内容。当内容超过100字时，后面会出现省略号。" },
        { title: "模块标题2", content: "这是模块2的内容。这里有一些关键词，比如搜索、测试、内容。" },
        { title: "模块标题3", content: "这是模块3的内容。它包含一些其他信息。" }
    ];
    const resultsContainer = document.getElementById("results-container");

    resultsContainer.innerHTML = "";
    contentModules.forEach(module => {
        const title = module.title.toLowerCase();
        const text = module.content.toLowerCase();
        if (title.includes(searchInput) || text.includes(searchInput)) {
            const resultDiv = document.createElement("div");
            resultDiv.className = "result-item";
            resultDiv.innerHTML = `
                <h2>${module.title}</h2>
                <p>${module.content}</p>
            `;
            resultsContainer.appendChild(resultDiv);
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".color-link");
    const body = document.body;

    links.forEach(link => {
        link.addEventListener("click", () => {
            applyColor(link.id);
        });
    });

    loadCachedColor();
});