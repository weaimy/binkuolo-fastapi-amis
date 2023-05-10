# -*- coding:utf-8 -*-
"""
@Time : 2022/5/18 1:03 AM
@Author: Donnie
@Des: 栏目管理
"""
from typing import List

from fastapi import APIRouter, Security, Query, Request
from tortoise.queryset import F
from core.Auth import check_permissions
from core.Response import fail, success
from schemas import category, base
from models.base import Role, Category, CategoryType, Access
from schemas.category import CreateCategory, UpdateCategory

router = APIRouter(prefix='/page')


@router.get("",
            summary="页面列表",
            dependencies=[Security(check_permissions)]
            )
async def page_list(req: Request):
    """
    获取所有栏目
    :return:
    """
    pages = [{"label": "Home", "url": "/", "redirect": "/index"}]
    
    # 非超级管理员
    access = []
    if not req.state.user_type:
        # 二级菜单权限
        two_level_access = await Access.filter(role__user__id=req.state.user_id, is_check=True).values_list("parent_id")
        two_level_access = [i[0] for i in two_level_access]
        # 一级菜单权限
        one_level_access = await Access.filter(id__in=list(set(two_level_access))).values_list("parent_id")
        one_level_access = [i[0] for i in one_level_access]

        query_access = await Access.filter(id__in=list(set(one_level_access + two_level_access))).values_list("scopes")
        access = [i[0] for i in query_access]

    return success(msg="提取成功", data=pages)


def page_tree(data, pid):
    """
    遍历栏目树
    :param data: rule[]
    :param pid: 父ID
    :return: list
    """
    result = []
    for item in data:
        if pid == item["parent_id"]:
            temp = page_tree(data, item["id"])
            if len(temp) > 0:
                item["children"] = temp
            result.append(item)
    return result