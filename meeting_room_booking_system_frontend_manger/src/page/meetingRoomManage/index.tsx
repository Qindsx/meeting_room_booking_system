import { Button, Form, Input, Table } from 'antd'
import './index.css'
import { useForm } from 'antd/es/form/Form'
import { useMemo, useState } from 'react'
import { ColumnsType } from 'antd/es/table'

interface RoomManageTableType {
  id:number,
  name: string,
  capacity: number,
  location: string,
  equipment: string,
  description: string,
  createTime: Date;
}

export const MeetingRoomManage = () => {
  const [form] = useForm()
  const [pageNo, setPageNo] = useState()
  const [pageSize, setPageSize] = useState()

  const columns: ColumnsType<RoomManageTableType> = useMemo(() => [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '容纳人数',
      dataIndex: 'number',
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
          <a href="#" onClick={() => { deelte(record.id) }}>删除</a>
        </span>
      )
    }
  ], [])

  // 删除
  const deelte = (id:number) => {

  }

  // 修改
  const update = (record:RoomManageTableType)=>{

  }

  // 列表请求
  const searchRoom = () => {
    const name = form.getFieldValue('name')
    const capacity = form.getFieldValue('capacity')
    const equipment = form.getFieldValue('equipment')

  }
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
      <Table columns={columns}></Table>
    </div>
  </div>

}