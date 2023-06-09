# -*- coding:utf-8 -*-
"""
@Time : 2022/4/23 8:33 PM
@Author: weaimy
@Des: views home
"""
from fastapi import Request, APIRouter
from fastapi.responses import HTMLResponse

from core.Utils import get_tree, isMobile
from models.base import Category

router = APIRouter()


@router.get("/", tags=["官网首页"], response_class=HTMLResponse)
async def home(request: Request):
    """
    官网首页
    :param request:
    :return:
    """
    userAgent = request.headers['User-Agent']
    print(isMobile(request))
    result = await Category.annotate().order_by('-sort').all() \
        .values("id", "title", "parent_id", "type", "url", "sort", "status", "create_time", "update_time")
    cate_list = get_tree(result, 0)

    if isMobile(request):
        return request.app.state.mobile_views.TemplateResponse("index.html", {"request": request, "cate_list": cate_list})
    else:
        return request.app.state.views.TemplateResponse("index.html", {"request": request, "cate_list": cate_list})
