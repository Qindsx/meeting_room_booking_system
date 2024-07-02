import { Button, Form, Input, Popconfirm, Table, message } from 'antd'
import './index.css'
import { useForm } from 'antd/es/form/Form'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ColumnsType } from 'antd/es/table'
import { deleteRoom, searchManage } from '../../api/manage'

interface RoomManageTableType {
  id: number,
  name: string,
  capacity: number,
  location: string,
  equipment: string,
  description: string,
  createTime: Date;
}

interface SearchType {
  equipment: string,
  name: string,
  capacity: string,
}

export const MeetingRoomManage = () => {
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [listData, setListData] = useState<RoomManageTableType[]>([])

  const columns: ColumnsType<RoomManageTableType> = useMemo(() => [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '容纳人数',
      dataIndex: 'capacity',
    },
    {
      title: '位置',
      dataIndex: 'location',
    },
    {
      title: '设备',
      dataIndex: 'equipment',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      render: (_, record) => (
        <span>
          <a href="#" onClick={() => { update(record) }}>修改</a>
          <Popconfirm
            title="是否删除"
            description="确认删除该条会议室信息吗?"
            onConfirm={()=>{deleteRoomClick(record.id)}}
            onCancel={()=>{}}
            okText="Yes"
            cancelText="No"
          >
            <a href="#">删除</a>
          </Popconfirm>
        </span>
      )
    }
  ], [])

  // 分页事件
  const changePage = useCallback((page: number, pageNumer: number) => {
    setPageNo(page)
    setPageSize(pageNumer)
  }, [])

  // 删除
  const deleteRoomClick = useCallback(async (id: number) => {
    try {
      const res = await deleteRoom(id)
      if(res.data.code == 200) {
        message.success('删除成功')
        searchRoom({ name: form.getFieldValue('name') || '', capacity: form.getFieldValue('capacity') || '', equipment: form.getFieldValue('equipment') || '' })
      }
    } catch (error) {
      message.error('系统错误')
    }
  }, [])

  // 修改
  const update = (record: RoomManageTableType) => {

  }

  // 列表请求
  const searchRoom = useCallback(async (searchVale: SearchType) => {
    try {
      const { data } = await searchManage(searchVale.name, searchVale.capacity, searchVale.equipment, pageNo, pageSize)

      setListData(data.data.meetingRoomList.map((item: RoomManageTableType) => {
        return {
          key: item.id,
          ...item
        }
      }))
    } catch (error) {
      message.error('系统错误')
    }

  }, [])

  const [form] = useForm()
  useEffect(() => {
    searchRoom({ name: form.getFieldValue('name') || '', capacity: form.getFieldValue('capacity') || '', equipment: form.getFieldValue('equipment') || '' })
  }, [pageNo, pageSize])
  return <div id="userManage-container">
    <div className='userManage-container'>
      <Form
        form={form}
        name='search'
        layout='inline'
        colon={false}
        onFinish={searchRoom}
      >
        {/* name */}
        <Form.Item label="名称" name="name">
          <Input />
        </Form.Item>
        {/* capacity */}
        <Form.Item label="描述" name="capacity">
          <Input />
        </Form.Item>
        {/* equipment */}
        <Form.Item label="设备" name="equipment">
          <Input />
        </Form.Item>
        <Form.Item label=" ">
          <Button type="primary" htmlType="submit">
            搜索会议室
          </Button>
        </Form.Item>
      </Form>
    </div>
    <div className='userManage-table'>
      <Table
        dataSource={listData}
        columns={columns}
        pagination={{
          current: pageNo,
          pageSize,
          onChange: changePage
        }
        }>
      </Table>
    </div>
  </div>

}