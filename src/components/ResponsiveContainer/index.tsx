// src/components/ResponsiveContainer.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import styles from "./index.module.less";
import { Button } from "antd-mobile";

interface ResponsiveContainerProps {
  children: React.ReactNode;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    // 设置 meta 标签确保页面在移动端设备上呈现最佳效果
    const metaTag = document.createElement("meta");
    metaTag.name = "viewport";
    metaTag.content = "width=device-width, initial-scale=1, maximum-scale=1";
    document.head.appendChild(metaTag);

    return () => {
      document.head.removeChild(metaTag);
    };
  }, []);

  return (
    <>
      <div className={styles.container}>
        {location?.pathname !== "/" && (
          <div className={styles.topBar}>
            <Button color="default" onClick={() => navigate(-1)}>
              返回
            </Button>
          </div>
        )}
        <div>{children}</div>
      </div>
    </>
  );
};

export default ResponsiveContainer;
