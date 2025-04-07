function searchContent() {
    const searchInput = document.getElementById('search-input').value;
    // 这里只是示例，实际需要根据具体的数据来源进行搜索逻辑编写
    const results = [];
    if (searchInput) {
        // 模拟搜索结果
        results.push({ title: '创意思维培养方法', link: 'article.html' });
    }
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';
    const resultsCount = document.getElementById('results-count');
    resultsCount.textContent = results.length;
    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        const resultLink = document.createElement('a');
        resultLink.href = result.link;
        resultLink.textContent = result.title;
        resultItem.appendChild(resultLink);
        resultsContainer.appendChild(resultItem);
    });
}