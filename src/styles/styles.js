import styled from "styled-components";

export const ContentWrapper = styled.div`
  max-width: 720px;
  margin: 0 auto;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

export const Heading = styled.h1`
  color: black;
  font-size: 2rem;
  font-weight: bold;
`;

export const Paragraph = styled.p`
  font-size: 1rem;
  color: #333;
`;

export const Page = styled.div`
  font-family: system-ui, sans-serif;
  padding: 16px;
  max-width: ${({ $width }) => $width + 32}px;
`;

export const ErrorText = styled.p`
  margin: 0 0 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.danger};
`;

export const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 8px;
  font-size: 14px;
`;

export const LegendItem = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const Dot = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

export const Canvas = styled.div`
  position: relative;
  min-height: 120px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
`;

export const theme = {
  colors: {
    main: "#333",
    follower: "#1f6f8b",
    following: "#b85f12",
    mutual: "#6b4fa0",
    border: "#ddd",
    muted: "#57606a",
    danger: "#b3261e",
    action: "#0000cc",
  },
};

export const Toolbar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

export const Input = styled.input`
  flex: 1;
  min-width: 0;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #bbb;
  border-radius: 6px;
`;

export const Button = styled.button`
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.action};
  color: #fff;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const Empty = styled.p`
  margin: 0;
  padding: 24px;
  font-size: 14px;
  opacity: 0.7;
`;

export const Hint = styled.p`
  margin: 8px 0 0;
  font-size: 13px;
  opacity: 0.7;
`;

export const Svg = styled.svg`
  display: block;
  max-width: 100%;
  height: auto;

  .node:focus-visible circle {
    stroke: #f2c230;
    stroke-width: 3px;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.45);
`;

export const Dialog = styled.div`
  position: relative;
  width: 100%;
  max-width: 340px;
  padding: 24px;
  border-radius: 12px;
  background: #fff;
  color: #24292f;
  font-family: system-ui, sans-serif;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 6px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
`;

export const Profile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
`;

export const Username = styled.h2`
  margin: 8px 0 0;
  font-size: 20px;
  overflow-wrap: anywhere;
`;

export const Bio = styled.p`
  margin: 4px 0;
  font-size: 14px;
  line-height: 1.5;
  color: ${({ $error, theme }) => ($error ? theme.colors.danger : "inherit")};
`;

export const Location = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`;

export const ProfileLink = styled.a`
  margin-top: 12px;
  padding: 8px 16px;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.main};
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
`;

export const AvatarImg = styled.img`
  border: 1px solid #d0d7de;
  border-radius: 50%;
`;

export const AvatarFallback = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  background: #d0d7de;
  color: #24292f;
  font-size: ${({ $size }) => $size / 2.4}px;
  font-weight: 600;
`;
