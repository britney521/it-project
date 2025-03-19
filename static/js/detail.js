  $(document).ready(function() {
        $('.star').click(function() {
            var score = $(this).data('score');
            $('#scoreInput').val(score);

            // 填充星星
            $('.star').removeClass('filled');
            $('.star').removeClass('fas').addClass('far'); // Reset all stars to far fa star
            for (var i = 1; i <= score; i++) {
                $('.star[data-score="' + i + '"]').addClass('filled').removeClass('far').addClass('fas'); // 填充星星为 fas fa-star
            }
        });
        $('#favorite-button').click(function() {
        const restaurantId = $(this).data('restaurant-id');
        const button = $(this); // Save references to buttons for easy subsequent operations

        $.ajax({
            url: `/favorite/${restaurantId}/`,
            method: 'POST',
            data: JSON.stringify({ restaurant_id: restaurantId }),
            contentType: 'application/json',
            success: function(data) {
                if (data.success) {
                    // Modify the icon and text of the button
                    button.html('<i class="fas fa-heart text-danger"></i> collected');
                    button.addClass('btn-secondary').removeClass('btn-primary'); // Change button style
                    alert('Restaurant added to favorites!');
                } else {
                    alert('Error: ' + data.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });
    });
    });

 $('#toggleCommentForm').click(function() {
            $('#commentFormContainer').toggle();
        });

 // 添加图片点击事件监听
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('.gallery-main img, .gallery-thumbnail, .card-img-top').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function() {
            const modalImg = document.getElementById('zoomedImage');
            modalImg.src = this.src;
            new bootstrap.Modal(document.getElementById('imageModal')).show();
        });
    });
});

// 评分动画 (4.8动态增长效果)
    const ratingElement = document.querySelector(".rating-large");
    let rating = 0.0;
    let finalRating = parseFloat(ratingElement.textContent);
    ratingElement.textContent = "0.0";

    const interval = setInterval(() => {
        if (rating < finalRating) {
            rating += 0.1;
            ratingElement.textContent = rating.toFixed(1);
        } else {
            ratingElement.textContent = finalRating.toFixed(1);
            clearInterval(interval);
        }
    }, 50);