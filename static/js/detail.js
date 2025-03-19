  $(document).ready(function() {
        $('.star').click(function() {
            var score = $(this).data('score');
            $('#scoreInput').val(score);

            // 填充星星
            $('.star').removeClass('filled');
            $('.star').removeClass('fas').addClass('far'); // 重置所有星星为 far fa-star
            for (var i = 1; i <= score; i++) {
                $('.star[data-score="' + i + '"]').addClass('filled').removeClass('far').addClass('fas'); // 填充星星为 fas fa-star
            }
        });
        $('#favorite-button').click(function() {
        const restaurantId = $(this).data('restaurant-id');
        const button = $(this); // 保存对按钮的引用，方便后续操作

        $.ajax({
            url: `/favorite/${restaurantId}/`,
            method: 'POST',
            data: JSON.stringify({ restaurant_id: restaurantId }),
            contentType: 'application/json',
            success: function(data) {
                if (data.success) {
                    // 修改按钮的图标和文字
                    button.html('<i class="fas fa-heart text-danger"></i> collected');
                    button.addClass('btn-secondary').removeClass('btn-primary'); // 改变按钮样式
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