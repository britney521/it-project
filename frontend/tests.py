import os

from PIL import Image

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "IT_Project.settings")
import django

django.setup()

from frontend.models import RestaurantType, Restaurant, RecommendedDish

from PIL import Image
import os


def convert_images_to_webp_and_replace(input_folder):
    """
    遍历指定文件夹中的图片，将它们转换为 WebP 格式，并替换原始文件。

    :param input_folder: 包含原始图片的文件夹路径
    """
    # 支持的图片格式
    supported_formats = ('.jpg', '.jpeg', '.png', '.bmp', '.gif')

    # 遍历输入文件夹中的所有文件
    for filename in os.listdir(input_folder):
        if filename.lower().endswith(supported_formats):
            input_path = os.path.join(input_folder, filename)
            output_path = os.path.join(input_folder, os.path.splitext(filename)[0] + '.webp')

            try:
                # 打开图片
                with Image.open(input_path) as img:
                    # 保存为 WebP 格式
                    img.save(output_path, 'WEBP')
                print(f"已成功将 {input_path} 转换为 {output_path}")

                # 删除原始文件
                os.remove(input_path)
                print(f"已删除原始文件 {input_path}")
            except Exception as e:
                print(f"转换失败: {input_path} -> {e}")


# 示例用法
input_folder = "../media/recommended_dishes/"  # 替换为你的文件夹路径

convert_images_to_webp_and_replace(input_folder)