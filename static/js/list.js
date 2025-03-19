$(document).ready(function() {
   $('.view-restaurant-btn').click(function(event) {
        event.preventDefault(); // 阻止默认的链接行为

        // 检查用户是否已登录
        var isAuthenticated = $('#user-is-authenticated').val() === 'True';

        if (isAuthenticated) {
            // 如果用户已登录，跳转到餐厅详情页面
            var restaurantId = $(this).data('restaurant-id');
            window.location.href = "/restaurant/" + restaurantId + "/"; // 替换为你的餐厅详情页面 URL
        } else {
            // 如果用户未登录，显示提示信息并跳转到登录页面
            alert('Please log in to view the restaurant details.');
            window.location.href = "/Login/"; // 替换为你的登录页面 URL
        }
    });
});