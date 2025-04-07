document.addEventListener("DOMContentLoaded", function() {
    // 1. 文章目录导航
    function createTOC() {
        try {
            const articleContent = document.querySelector('.article-content');
            if (!articleContent) return;

            const headings = articleContent.querySelectorAll('h2[id]');
            if (headings.length < 2) return;

            const tocContainer = document.createElement('div');
            tocContainer.className = 'article-toc';
            
            const tocTitle = document.createElement('h3');
            tocTitle.textContent = '文章目录';
            tocContainer.appendChild(tocTitle);
            
            const tocList = document.createElement('ul');
            tocList.className = 'toc-list';
            
            headings.forEach((heading) => {
                const tocItem = document.createElement('li');
                const tocLink = document.createElement('a');
                tocLink.href = `#${heading.id}`;
                tocLink.textContent = heading.textContent;
                
                tocLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    scrollToHeading(heading.id);
                });
                
                tocItem.appendChild(tocLink);
                tocList.appendChild(tocItem);
            });
            
            tocContainer.appendChild(tocList);
            articleContent.insertBefore(tocContainer, articleContent.firstChild);
        } catch (error) {
            console.error('生成目录时出错:', error);
        }
    }

    function scrollToHeading(id) {
        const heading = document.getElementById(id);
        if (!heading) return;

        const headerOffset = 80;
        const elementPosition = heading.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        // 更新URL但不触发跳转
        history.replaceState(null, null, `#${id}`);
    }

    // 2. 图片灯箱效果
    function initLightbox() {
        try {
            const images = document.querySelectorAll('.article-content img:not(.no-lightbox), .article-gallery img');
            if (images.length === 0) return;

            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <img src="" alt="">
                    <div class="lightbox-caption"></div>
                </div>
                <button class="lightbox-close" aria-label="关闭">&times;</button>
                <button class="lightbox-prev" aria-label="上一张"><i class="fas fa-chevron-left"></i></button>
                <button class="lightbox-next" aria-label="下一张"><i class="fas fa-chevron-right"></i></button>
            `;
            document.body.appendChild(lightbox);

            let currentImageIndex = 0;
            const imageArray = Array.from(images);

            function showLightbox(index) {
                if (index < 0 || index >= imageArray.length) return;
                
                const img = imageArray[index];
                const lightboxImg = lightbox.querySelector('.lightbox-content img');
                const caption = lightbox.querySelector('.lightbox-caption');
                
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                caption.textContent = img.dataset.caption || img.alt || '';
                lightbox.classList.add('active');
                currentImageIndex = index;
                document.body.style.overflow = 'hidden';
            }

            function hideLightbox() {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }

            images.forEach((img, index) => {
                img.style.cursor = 'zoom-in';
                img.setAttribute('tabindex', '0');
                img.setAttribute('role', 'button');
                img.setAttribute('aria-label', '点击放大图片');
                
                img.addEventListener('click', function(e) {
                    e.preventDefault();
                    showLightbox(index);
                });
                
                img.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        showLightbox(index);
                    }
                });
            });

            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                    hideLightbox();
                }
            });

            const prevBtn = lightbox.querySelector('.lightbox-prev');
            const nextBtn = lightbox.querySelector('.lightbox-next');

            prevBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                showLightbox((currentImageIndex - 1 + imageArray.length) % imageArray.length);
            });

            nextBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                showLightbox((currentImageIndex + 1) % imageArray.length);
            });

            function handleKeyDown(e) {
                if (!lightbox.classList.contains('active')) return;
                
                switch(e.key) {
                    case 'Escape':
                        hideLightbox();
                        break;
                    case 'ArrowLeft':
                        prevBtn.click();
                        break;
                    case 'ArrowRight':
                        nextBtn.click();
                        break;
                }
            }

            document.addEventListener('keydown', handleKeyDown);

            // 返回清理函数
            return function cleanup() {
                document.removeEventListener('keydown', handleKeyDown);
                lightbox.remove();
            };
        } catch (error) {
            console.error('初始化灯箱时出错:', error);
            return null;
        }
    }

    // 3. 表情选择器
    function initEmojiPicker() {
        try {
            const emojiBtn = document.querySelector('.emoji-picker');
            const textarea = document.querySelector('.comment-form textarea');
            
            if (!emojiBtn || !textarea) return;
            
            const emojiContainer = document.createElement('div');
            emojiContainer.className = 'emoji-container';
            emojiContainer.style.display = 'none';
            emojiContainer.setAttribute('aria-hidden', 'true');
            
            const popularEmojis = ['😀', '😂', '😍', '👍', '❤️', '🔥', '🎉', '🙏', '🤔', '😎'];
            
            popularEmojis.forEach(emoji => {
                const emojiEl = document.createElement('button');
                emojiEl.className = 'emoji';
                emojiEl.textContent = emoji;
                emojiEl.setAttribute('aria-label', emoji);
                emojiEl.setAttribute('type', 'button');
                
                emojiEl.addEventListener('click', function(e) {
                    e.stopPropagation();
                    insertAtCursor(textarea, emoji);
                    emojiContainer.style.display = 'none';
                });
                
                emojiContainer.appendChild(emojiEl);
            });
            
            document.body.appendChild(emojiContainer);
            
            function insertAtCursor(field, value) {
                if (field.selectionStart || field.selectionStart === 0) {
                    const startPos = field.selectionStart;
                    const endPos = field.selectionEnd;
                    field.value = field.value.substring(0, startPos) + 
                                  value + 
                                  field.value.substring(endPos);
                    field.selectionStart = field.selectionEnd = startPos + value.length;
                } else {
                    field.value += value;
                }
                field.focus();
            }
            
            function toggleEmojiPanel(e) {
                e.stopPropagation();
                const isShowing = emojiContainer.style.display === 'flex';
                
                if (!isShowing) {
                    const btnRect = emojiBtn.getBoundingClientRect();
                    emojiContainer.style.top = `${btnRect.top - emojiContainer.offsetHeight - 10}px`;
                    emojiContainer.style.left = `${btnRect.left}px`;
                }
                
                emojiContainer.style.display = isShowing ? 'none' : 'flex';
                emojiContainer.setAttribute('aria-hidden', isShowing ? 'true' : 'false');
            }
            
            emojiBtn.addEventListener('click', toggleEmojiPanel);
            
            document.addEventListener('click', function(e) {
                if (emojiContainer.style.display === 'flex' && 
                    !emojiContainer.contains(e.target) && 
                    e.target !== emojiBtn) {
                    emojiContainer.style.display = 'none';
                    emojiContainer.setAttribute('aria-hidden', 'true');
                }
            });
            
            // 防止点击面板内部时关闭
            emojiContainer.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        } catch (error) {
            console.error('初始化表情选择器时出错:', error);
        }
    }

    // 4. 评论表单提交
    function initCommentForm() {
        try {
            const form = document.querySelector('.comment-form form');
            if (!form) return;
            
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                const textarea = form.querySelector('textarea');
                const submitBtn = form.querySelector('.submit-btn');
                const comment = textarea.value.trim();
                
                if (!comment) {
                    showAlert('请输入评论内容', 'error');
                    return;
                }
                
                // 显示加载状态
                const originalText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
                
                try {
                    // 模拟API请求延迟
                    await new Promise(resolve => setTimeout(resolve, 800));
                    
                    addNewComment({
                        author: '当前用户',
                        time: '刚刚',
                        text: comment,
                        likes: 0
                    });
                    
                    textarea.value = '';
                    showAlert('评论发表成功!', 'success');
                    updateCommentCount(1);
                } catch (error) {
                    console.error('提交评论失败:', error);
                    showAlert('评论提交失败，请重试', 'error');
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            });
            
            function showAlert(message, type) {
                const existingAlert = document.querySelector('.form-alert');
                if (existingAlert) existingAlert.remove();
                
                const alert = document.createElement('div');
                alert.className = `form-alert ${type}`;
                alert.textContent = message;
                alert.setAttribute('role', 'alert');
                form.appendChild(alert);
                
                setTimeout(() => {
                    alert.remove();
                }, 3000);
            }
            
            function addNewComment(data) {
                const commentEl = document.createElement('div');
                commentEl.className = 'comment';
                commentEl.innerHTML = `
                    <div class="comment-avatar">
                        <i class="fas fa-user-circle" aria-hidden="true"></i>
                    </div>
                    <div class="comment-content">
                        <div class="comment-header">
                            <span class="comment-author">${data.author}</span>
                            <span class="comment-time">${data.time}</span>
                        </div>
                        <div class="comment-text">${data.text}</div>
                        <div class="comment-actions">
                            <button class="like-btn" aria-label="点赞">
                                <i class="far fa-thumbs-up" aria-hidden="true"></i> 
                                <span>${data.likes}</span>
                            </button>
                            <button class="reply-btn" aria-label="回复">回复</button>
                        </div>
                    </div>
                `;
                
                const commentsList = document.querySelector('.comments-list');
                if (commentsList) {
                    commentsList.prepend(commentEl);
                    initCommentInteractions(commentEl);
                }
            }
            
            function updateCommentCount(increment) {
                const countEl = document.querySelector('.comment-count');
                if (countEl) {
                    const current = parseInt(countEl.textContent) || 0;
                    countEl.textContent = `(${current + increment})`;
                }
            }
        } catch (error) {
            console.error('初始化评论表单时出错:', error);
        }
    }

    // 5. 初始化评论交互
    function initCommentInteractions(commentEl) {
        try {
            // 点赞功能
            const likeBtn = commentEl.querySelector('.like-btn');
            if (likeBtn) {
                likeBtn.addEventListener('click', function() {
                    const countEl = this.querySelector('span');
                    if (!countEl) return;
                    
                    const currentCount = parseInt(countEl.textContent) || 0;
                    const isLiked = this.classList.contains('liked');
                    
                    if (!isLiked) {
                        countEl.textContent = currentCount + 1;
                        this.innerHTML = `<i class="fas fa-thumbs-up" aria-hidden="true"></i> <span>${currentCount + 1}</span>`;
                        this.classList.add('liked');
                        this.setAttribute('aria-label', '已点赞');
                    }
                });
            }
            
            // 回复功能
            const replyBtn = commentEl.querySelector('.reply-btn');
            if (replyBtn) {
                replyBtn.addEventListener('click', function() {
                    const textarea = document.querySelector('.comment-form textarea');
                    const author = commentEl.querySelector('.comment-author').textContent;
                    textarea.value = `@${author} `;
                    textarea.focus();
                });
            }
        } catch (error) {
            console.error('初始化评论交互时出错:', error);
        }
    }

    // 6. 阅读进度指示器
    function initReadingProgress() {
        try {
            const article = document.querySelector('.article-container');
            if (!article) return;
            
            const progressBar = document.createElement('div');
            progressBar.className = 'reading-progress';
            progressBar.setAttribute('aria-hidden', 'true');
            document.body.appendChild(progressBar);
            
            function updateProgress() {
                const articleHeight = article.offsetHeight;
                const articleTop = article.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (articleTop < 0 && articleTop + articleHeight > 0) {
                    const scrollPosition = window.pageYOffset;
                    const articleOffsetTop = article.offsetTop;
                    const progress = (scrollPosition - articleOffsetTop) / (articleHeight - windowHeight);
                    progressBar.style.width = `${Math.min(1, Math.max(0, progress)) * 100}%`;
                } else if (articleTop >= 0) {
                    progressBar.style.width = '0';
                } else {
                    progressBar.style.width = '100%';
                }
            }
            
            // 使用防抖优化性能
            let isThrottled = false;
            function throttledUpdate() {
                if (!isThrottled) {
                    updateProgress();
                    isThrottled = true;
                    setTimeout(() => {
                        isThrottled = false;
                    }, 100);
                }
            }
            
            window.addEventListener('scroll', throttledUpdate);
            window.addEventListener('resize', throttledUpdate);
            updateProgress();
        } catch (error) {
            console.error('初始化阅读进度条时出错:', error);
        }
    }

    // 7. 加载更多评论
    function initLoadMore() {
        try {
            const loadMoreBtn = document.querySelector('.load-more button');
            if (!loadMoreBtn) return;
            
            loadMoreBtn.addEventListener('click', async function() {
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载中...';
                
                // 模拟API请求延迟
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const mockComments = [
                    {
                        author: '赵设计师',
                        time: '2天前',
                        text: '六顶思考帽的方法在我们团队会议中特别有效，尤其是绿帽环节总能激发很多新点子。',
                        likes: 7
                    },
                    {
                        author: '创意小王子',
                        time: '3天前',
                        text: '散步法确实有效，我经常在遇到设计瓶颈时去楼下走走，回来就有新思路了。',
                        likes: 12
                    }
                ];
                
                mockComments.forEach(comment => {
                    const commentEl = document.createElement('div');
                    commentEl.className = 'comment';
                    commentEl.innerHTML = `
                        <div class="comment-avatar">
                            <i class="fas fa-user-circle" aria-hidden="true"></i>
                        </div>
                        <div class="comment-content">
                            <div class="comment-header">
                                <span class="comment-author">${comment.author}</span>
                                <span class="comment-time">${comment.time}</span>
                            </div>
                            <div class="comment-text">${comment.text}</div>
                            <div class="comment-actions">
                                <button class="like-btn" aria-label="点赞">
                                    <i class="far fa-thumbs-up" aria-hidden="true"></i> 
                                    <span>${comment.likes}</span>
                                </button>
                                <button class="reply-btn" aria-label="回复">回复</button>
                            </div>
                        </div>
                    `;
                    
                    const commentsList = document.querySelector('.comments-list');
                    if (commentsList) {
                        commentsList.appendChild(commentEl);
                        initCommentInteractions(commentEl);
                    }
                });
                
                updateCommentCount(mockComments.length);
                
                // 禁用按钮显示"没有更多评论"
                loadMoreBtn.disabled = true;
                loadMoreBtn.innerHTML = '没有更多评论了';
            });
            
            function updateCommentCount(increment) {
                const countEl = document.querySelector('.comment-count');
                if (countEl) {
                    const current = parseInt(countEl.textContent) || 0;
                    countEl.textContent = `(${current + increment})`;
                }
            }
        } catch (error) {
            console.error('初始化加载更多评论时出错:', error);
        }
    }

    // 8. 初始化现有评论的交互
    function initExistingComments() {
        try {
            document.querySelectorAll('.comment').forEach(comment => {
                initCommentInteractions(comment);
            });
        } catch (error) {
            console.error('初始化现有评论时出错:', error);
        }
    }

    // 初始化所有功能
    function initAll() {
        try {
            createTOC();
            const cleanupLightbox = initLightbox();
            initEmojiPicker();
            initCommentForm();
            initReadingProgress();
            initLoadMore();
            initExistingComments();
            
            // 返回清理函数
            return function cleanup() {
                if (cleanupLightbox) cleanupLightbox();
            };
        } catch (error) {
            console.error('初始化过程中出错:', error);
            return function() {};
        }
    }

    // 启动
    const cleanup = initAll();

    // 如果是SPA，可以在路由切换时执行清理
    // window.addEventListener('beforeunload', cleanup);
});