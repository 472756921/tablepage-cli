import { connect } from 'umi';
import { useState, useEffect } from 'react';
import { Button, Table, Form, Input, Pagination, Space, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import styles from './index.less';

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const defData = {
    recode: [
        { address: 111, id: 1, status: "ENABLE" },
        { address: 222, id: 2, status: "ENABLE" },
        { address: 333, id: 3, status: "DISABLE" },
    ],
    pageNo: 1, pageSize: 10, total: 100
}


const Index = ({ dispatch }) => {
    const [form] = Form.useForm();
    const [tableData, changeTableData] = useState(defData)
    const [queryData, changeQueryData] = useState({})
    const [deatilData, changeDeatilData] = useState({})
    const [selectedRows, changeSelectedRows] = useState([])
    const [disableStatusBtn, changeDisableStatusBtn] = useState(false)

    useEffect(() => {
        getTableData()
    }, [])

    const columns = [
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '',
            key: 'action',
            render: (text, record) => <span onClick={() => getDeatil(record, 'edit')}>edit</span>
        },
    ];
    // 查询表格数据
    const getTableData = (queryData = { pageNo: 1, pageSize: 10 }) => {
        dispatch({
            type: 'xxx/xxx', payload: queryData, cb: (data) => {
                changeTableData(data);
                changeQueryData(queryData);
            }
        });
    }
    // 查询单条详情
    const getDeatil = (data, mode = 'show') => {
        dispatch({
            type: 'xxx/xxx', payload: { id: data.id }, cb: (data) => {
                changeDeatilData({ ...data, mode });
            }
        });
    }
    // 新增数据
    const addItem = (mode) => {
        changeDeatilData({ mode });
    }
    // 翻页查询
    const onPageChange = (page, pageSize) => {
        getTableData({ ...queryData, page, pageSize })
    }
    // 导出
    const exportsData = () => {
        dispatch({ type: 'xxx/exportsData', payload: queryData });
    }
    // 状态变更
    const confirm = (status) => {
        if (selectedRows.length) {
            const ids = selectedRows.map(it => it.id)
            dispatch({
                type: 'xxx/xxx', payload: { ids, status: status }, cb: () => {
                    changeTableData(queryData);
                }
            });
        }
    }
    // 选中条目
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            if (selectedRows.length) {
                const initStatus = selectedRows[0].status;
                const dis = selectedRows.every(_ => _.status === initStatus);
                changeDisableStatusBtn(!dis);
            } else {
                changeDisableStatusBtn(false);
            }
            changeSelectedRows(selectedRows);
        },
    };

    return (
        <div className={styles.content}>
            <div className={styles.head}>
                <span className={styles.title}>标题</span>
                <Space className={styles.btnGroup}>
                    <Button onClick={() => exportsData()}>导出</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => addItem('add')}>新增</Button>
                </Space>
            </div>
            <div className={styles.formQuery}>
                <Form  {...formItemLayout}
                    layout='inline'
                    form={form}>
                    <Form.Item name='xxx' label='条件'>
                        <Input />
                    </Form.Item>
                    <Form.Item >
                        <Button type="primary" htmlType="submit">查询</Button>
                    </Form.Item>
                    <Form.Item >
                        <Button
                            htmlType="button"
                            onClick={() => {
                                form.resetFields();
                                getTableData()
                            }}>
                            重置
              </Button>
                    </Form.Item>
                </Form>
            </div>
            <Table rowKey={_ => _.id} dataSource={tableData?.recode} columns={columns} pagination={false}
                rowSelection={{
                    type: "checkbox",
                    ...rowSelection,
                }}
                onRow={record => {
                    return {
                        onDoubleClick: event => getDeatil(record),
                    };
                }}
            />
            <div className={styles.bottom}>
                <Space>
                    <span className={styles.checkedNum}>选中{selectedRows.length}项</span>
                    <Space>
                        <Popconfirm
                            title="确认停用该项?"
                            onConfirm={() => confirm('DISABLE')}
                            okText="Yes"
                            cancelText="No"
                            disabled={disableStatusBtn}
                        >
                            <Button disabled={disableStatusBtn}>停用</Button>
                        </Popconfirm>
                        <Popconfirm
                            title="确认启用该项?"
                            onConfirm={() => confirm('ENABLE')}
                            okText="Yes"
                            cancelText="No"
                            disabled={disableStatusBtn}
                        >
                            <Button disabled={disableStatusBtn}>启用</Button>
                        </Popconfirm>

                    </Space>
                </Space>
                <span className={styles.pagination}>
                    <Pagination
                        showSizeChanger
                        showQuickJumper
                        current={Number(tableData.pageNo)}
                        pageSize={Number(tableData.pageSize)}
                        total={Number(tableData.total)}
                        onChange={onPageChange} showTotal={total => `共 ${tableData.total} 项`} />
                </span>
            </div>
        </div >
    );
};

export default connect(({ loading }) => ({ loading }))(Index);
