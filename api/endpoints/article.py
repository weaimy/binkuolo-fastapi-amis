# -*- coding:utf-8 -*-
"""
@Time : 2023/5/16 22:53 PM
@Author: weaimy
@Des: 文章管理
"""
from core.Response import success, fail, res_antd
from models.base import Article
from schemas import article
from core.Auth import create_access_token, check_permissions
from fastapi import Request, Query, APIRouter, Security
from config import settings
from typing import List
from tortoise.queryset import F

router = APIRouter(prefix='/article')


@router.post("", summary="文章添加", dependencies=[Security(check_permissions, scopes=["article_add"])])
async def article_add(post: article.CreateArticle):
    """
    创建文章
    :param post: CreateArticle
    :return:
    """
    # 过滤文章
    get_article = await Article.get_or_none(title=post.title)
    if get_article:
        return fail(msg=f"文章名{post.title}已经存在!")

    # 创建文章
    create_article = await Article.create(**post.dict())
    if not create_article:
        return fail(msg=f"文章{post.title}创建失败!")
    return success(msg=f"文章{create_article.title}创建成功")


@router.delete("", summary="文章删除", dependencies=[Security(check_permissions, scopes=["article_delete"])])
async def article_del(req: Request, article_id: int):
    """
    删除文章
    :param req:
    :param article_id: int
    :return:
    """
    delete_action = await Article.filter(pk=article_id).delete()
    if not delete_action:
        return fail(msg=f"文章{article_id}删除失败!")
    return success(msg="删除成功")


@router.put("", summary="文章修改", dependencies=[Security(check_permissions, scopes=["article_update"])])
async def article_update(post: article.UpdateArticle):
    """
    更新文章信息
    :param post:
    :return:
    """
    article_check = await Article.get_or_none(pk=post.id)
    # 超级管理员或不存在的文章
    if not article or article_check.pk == 1:
        return fail(msg="文章不存在")

    if article_check.title != post.title:
        check_article_title = await Article.get_or_none(title=post.title)
        if check_article_title:
            return fail(msg=f"文章名{check_article_title.title}已存在")

    data = post.dict()
    data.pop("id")
    await Article.filter(pk=post.id).update(**data)
    return success(msg="更新成功!")


@router.get("",
            summary="文章列表",
            response_model=article.ArticleList,
            dependencies=[Security(check_permissions, scopes=["article_query"])]
            )
async def article_list(
        pageSize: int = 10,
        current: int = 1,
        title: str = Query(None),
        create_time: List[str] = Query(None)
):
    """
    获取所有管理员
    :return:
    """
    # 查询条件
    query = {}
    if title:
        query.setdefault('title', title)
    if create_time:
        query.setdefault('create_time__range', create_time)

    article_data = Article.annotate(key=F("id")).filter(**query).all()
    # 总数
    total = await article_data.count()
    # 查询
    data = await article_data.limit(pageSize).offset(pageSize * (current - 1)).order_by("-create_time") \
        .values(
        "key", "id", "title", "img", "content", "seo_key",
        "seo_desc", "create_time", "update_time")
    return res_antd(code=True, data=data, total=total)