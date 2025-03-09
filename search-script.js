document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const resultsContainer = document.getElementById("results-container");

    // 假设这是从首页动态加载的内容数据
    const contentData = [
        { title: "模块标题1", content: "这是模块1的内容。当内容超过100字时，后面会出现省略号。" },
        { title: "模块标题2", content: "这是模块2的内容。这里有一些关键词，比如搜索、测试、内容。" },
        { title: "模块标题3", content: "这是模块3的内容。它包含一些其他信息。" }
    ];

    function searchContent(keyword) {
        const results = contentData.filter(item => 
            item.title.toLowerCase().includes(keyword.toLowerCase()) || 
            item.content.toLowerCase().includes(keyword.toLowerCase())
        );

        displayResults(results);
    }

    function displayResults(results) {
        resultsContainer.innerHTML = ""; // 清空之前的搜索结果

        if (results.length === 0) {
            resultsContainer.innerHTML = "<p>没有找到匹配的内容。</p>";
            return;
        }

        results.forEach(result => {
            const resultDiv = document.createElement("div");
            resultDiv.className = "result-item";
            resultDiv.innerHTML = `
                <h3>${result.title}</h3>
                <p>${result.content}</p>
            `;
            resultsContainer.appendChild(resultDiv);
        });
    }

    searchInput.addEventListener("input", () => {
        const keyword = searchInput.value.trim();
        if (keyword) {
            searchContent(keyword);
        } else {
            resultsContainer.innerHTML = ""; // 如果搜索框为空，清空结果
        }
    });
});