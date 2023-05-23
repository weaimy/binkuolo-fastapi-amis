# -*- coding:utf-8 -*-
"""
@Time : 2023/5/16 22:53 PM
@Author: weaimy
@Des: 招聘管理
"""
from enum import Enum
from tortoise import fields
from tortoise.query_utils import Prefetch

from core.Response import success, fail, res_antd
from models.base import WorkNature, WorkEducation, WorkMoney, WorkAge, WorkNum, Status, Job
from schemas import job
from core.Auth import create_access_token, check_permissions
from fastapi import Request, Query, APIRouter, Security
from config import settings
from typing import List

router = APIRouter(prefix='/options')


class ModelName(str, Enum):
    WorkNature = "work_nature"
    WorkEducation = "work_education"
    WorkMoney = "work_money"
    WorkAge = "work_age"
    WorkNum = "work_num"
    Status = "status"


def ret_obj(obj_str):
    # 此处为实现关键 通过字符串转成类名
    object = globals()[obj_str]
    return object


@router.get("/{model_name}")
async def info(model_name: ModelName):
    model = model_name.name
    options = []
    for k, v in ret_obj(model).__members__.items():
        options.append({"label": v.value, "value": v.value})
    return success(data={"options": options})


@router.get("/info/{model_name}")
async def model_info():
    print(model_to_dict(Job))
    # options = []
    # for k, v in ret_obj(model_name).__members__.items():
    #     options.append({"label": k, "value": v.value})
    # return success(data={"options": options})


def model_to_dict(model):
    data = {}
    for k, v in model._meta.fields_map.items():
        # print(field)
        print(k, type(v))
        # value = getattr(model._meta, field)
        # if isinstance(v, fields.IntField):
        #     print(k, fields.IntField.__dict__)
        if isinstance(v, fields.data.CharEnumFieldInstance):
            # print(v.default.value, v.description)
            value = v.default.value
            options = []
            for ik, iv in v.enum_type.__members__.items():
                # print(ik, iv.value)
                options.append({"label": iv.value, "value": iv.value})
            print({"value": value, "options": options})
        # if isinstance(field, fields.ForeignKeyField):
        #     if value:
        #         value = value.id
        #     else:
        #         value = None
        # data[k] = v
    return data
