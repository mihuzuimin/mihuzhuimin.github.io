document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".color-link");
    const body = document.body;

    // 应用颜色主题
    function applyColor(color) {
        if (color === "gulf-blue") {
            body.style.background = "#26b3e6"; // 海湾蓝
        } else if (color === "sunset-purple") {
            body.style.background = "rgb(193, 161, 180)"; // 霞光紫
        } else if (color === "vivid-magenta") {
            body.style.background = "rgb(197, 40, 115)"; // 璀璨洋红
        } else if (color === "lightning-yellow") {
            body.style.background = "rgb(255, 210, 63)"; // 闪电黄
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

    links.forEach(link => {
        link.addEventListener("click", () => {
            applyColor(link.id);
        });
    });

    loadCachedColor();

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

    const searchButton = document.querySelector("button");
    searchButton.addEventListener("click", searchContent);
});
