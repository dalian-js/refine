import React from "react";
import type { HttpError } from "@refinedev/core";

import { Edit, useForm, useSelect } from "@refinedev/antd";

import type { RcFile } from "antd/lib/upload/interface";
import { Form, Input, Select, Upload } from "antd";

import MDEditor from "@uiw/react-md-editor";

import type { IPost, IPostVariables, ICategory } from "../../interfaces";
import { normalizeFile, storage } from "../../utility";

export const PostEdit = () => {
  const { formProps, saveButtonProps, queryResult } = useForm<
    IPost,
    HttpError,
    IPostVariables
  >({
    queryOptions: {
      select: ({ data }) => {
        return {
          data: {
            ...data,
            images: data.images ? JSON.parse(data.images) : undefined,
          },
        };
      },
    },
  });

  const postData = queryResult?.data?.data;
  const { selectProps: categorySelectProps } = useSelect<ICategory>({
    resource: "61c43adc284ac",
    defaultValue: postData?.categoryId,
    optionLabel: "title",
    optionValue: "id",
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        onFinish={(values) => {
          formProps.onFinish?.({
            ...values,
            images: JSON.stringify(values.images),
          });
        }}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Category"
          name="categoryId"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select {...categorySelectProps} />
        </Form.Item>
        <Form.Item
          label="Content"
          name="content"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <MDEditor data-color-mode="light" />
        </Form.Item>
        <Form.Item label="Images">
          <Form.Item
            name="images"
            valuePropName="fileList"
            normalize={normalizeFile}
            noStyle
          >
            <Upload.Dragger
              name="file"
              listType="picture"
              multiple
              customRequest={async ({ file, onError, onSuccess }) => {
                try {
                  const rcFile = file as RcFile;

                  const { $id } = await storage.createFile(
                    "default",
                    rcFile.name,
                    rcFile,
                  );

                  const url = storage.getFileView("default", $id);

                  onSuccess?.({ url }, new XMLHttpRequest());
                } catch (error) {
                  onError?.(new Error("Upload Error"));
                }
              }}
            >
              <p className="ant-upload-text">
                Drag &amp; drop a file in this area
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form.Item>
      </Form>
    </Edit>
  );
};
