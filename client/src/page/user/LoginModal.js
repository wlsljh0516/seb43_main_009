import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authSlice';
import { Link } from 'react-router-dom';
import { Axios } from '../../utils/api';
import logo from '../../../public/logo.png';
import {
  ModalWrapper,
  ModalContent,
  CloseButton,
  LoginWrapperForModal,
  Logo,
  GoogleLogin,
  KakaoLogin,
  NaverLogin,
  EmailLogin,
  EmailWrapper,
  EmailLabel,
  EmailInput,
  PasswordWrapper,
  PasswordLabel,
  PasswordInput,
  LoginButton,
  Message,
  StyledLink,
} from '../../style/LoginStyle';

const LoginModal = ({ onClose, isClosing }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('hello@gmail.com');
  const [password, setPassword] = useState('1234');
  window.scrollTo(0, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post(
        'https://server.dowajoyak.shop/users/login',
        {
          username: email,
          password,
        },
      );
      const accessToken = response.headers['authorization'];
      const refreshToken = response.headers['refresh'];
      localStorage.setItem('accessToken', accessToken);
      const date = new Date();
      //쿠키 만료시간 7일뒤
      date.setDate(date.getDate() + 7);
      document.cookie = `refreshToken=${refreshToken}; expires=${date.toUTCString()}; path=/`;
      alert('로그인 성공!');
      navigate('/');
      dispatch(login());
    } catch (error) {
      alert('로그인에 실패했습니다! Email과 Password를 다시 확인해주세요.');
      console.error(error);
    }
  };
  return (
    <ModalWrapper>
      <ModalContent isClosing={isClosing}>
        <CloseButton onClick={onClose}>X</CloseButton>
        <LoginWrapperForModal>
          <Logo src={logo} alt="logo" />
          <GoogleLogin href="https://server.dowajoyak.shop/oauth2/authorization/google">
            구글로 로그인
          </GoogleLogin>
          <KakaoLogin href="https://server.dowajoyak.shop/oauth2/authorization/kakao">
            카카오로 로그인
          </KakaoLogin>
          <NaverLogin href="https://server.dowajoyak.shop/oauth2/authorization/naver">
            네이버로 로그인
          </NaverLogin>
          <EmailLogin onSubmit={handleSubmit}>
            <EmailWrapper>
              <EmailLabel>이메일</EmailLabel>
            </EmailWrapper>
            <EmailInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordWrapper>
              <PasswordLabel>비밀번호</PasswordLabel>
            </PasswordWrapper>
            <PasswordInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <LoginButton type="submit">로그인</LoginButton>
            <Message>아직 회원이 아니신가요?</Message>
            <StyledLink to="/signup">회원가입</StyledLink>
          </EmailLogin>
        </LoginWrapperForModal>
      </ModalContent>
    </ModalWrapper>
  );
};

export default LoginModal;
