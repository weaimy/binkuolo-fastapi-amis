# -*- coding:utf-8 -*-
"""
@Time : 2022/5/18 1:03 AM
@Author: Donnie
@Des: 栏目管理
"""
from typing import List

from fastapi import APIRouter, Security, Query
from tortoise.queryset import F
from core.Auth import check_permissions
from core.Response import fail, success
from schemas import category, base
from models.base import Role, Category
from schemas.category import CreateCategory

router = APIRouter(prefix='/category')


@router.post("",
             summary="栏目添加",
             dependencies=[Security(check_permissions, scopes=["category_add"])]
             )
async def create_article(post: CreateCategory):
    """
    创建文章
    :param post: CreateArticle
    :return:
    """
    result = await Category.create(**post.dict())
    if not result:
        return fail(msg="创建失败!")
    return success(msg="创建成功!")


@router.get("",
            summary="栏目列表",
            dependencies=[Security(check_permissions, scopes=["category_query"])]
            )
async def category_list():
    """
    获取所有栏目
    :return:
    """
    result = await Category.annotate().all() \
        .values("id", "title", "parent_id", "status", "create_time", "update_time")
    # 总数
    total = len(result)
    tree_data = category_tree(result, 0)

    return success(msg="提取成功", data={"count": total, "rows": tree_data})


def category_tree(data, pid):
    """
    遍历栏目树
    :param data: rule[]
    :param pid: 父ID
    :return: list
    """
    result = []
    for item in data:
        item["label"] = str(item["title"])
        item["value"] = str(item["id"])
        if pid == item["parent_id"]:
            temp = category_tree(data, item["id"])
            if len(temp) > 0:
                item["children"] = temp
            result.append(item)
    return result

