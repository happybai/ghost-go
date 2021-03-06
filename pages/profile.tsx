import {useState, useEffect} from 'react';
import {
  Container,
  Header,
  Tab,
  Form,
  Input,
  TextArea,
  Select,
  Button,
  InputOnChangeData,
  Divider,
} from 'semantic-ui-react';
import {
  Toast,
  useDispatch,
  useTypedSelector,
  useUpdateEffect,
  useAuth,
} from 'utils';
import {UserAvatar} from 'components/common';
import {RANK_OPTIONS, GENDER_OPTIONS} from 'utils/constants';
import {fetchProfile, updateUser, updatePassword} from 'slices';

const Profile = () => {
  const {token, user} = useAuth();
  const profile = useTypedSelector(i => i.profile);
  const updatedUser = useTypedSelector(i => i.updatedUser);
  const updatedPassword = useTypedSelector(i => i.updatedPassword);
  const [info, setInfo] = useState({
    email: '',
    display_name: '',
    name: '',
    ranking: '',
    gender: '',
    bio: '',
  });
  const [pwd, setPwd] = useState({
    password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const dispatch = useDispatch();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    {name, value}: InputOnChangeData
  ) => {
    setInfo({...info, [name]: value});
  };

  const handlePwdChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    {name, value}: InputOnChangeData
  ) => {
    setPwd({...pwd, [name]: value});
  };

  const handleUpdateProfile = async () => {
    const res = await dispatch(
      updateUser({
        pattern: {
          id: user.data.id,
        },
        data: {
          user: info,
        },
      })
    );
  };

  const handleUpdatePassword = async () => {
    const res = await dispatch(
      updatePassword({
        data: {...pwd},
      })
    );
  };

  const panes = user && [
    {
      menuItem: {key: 'users', content: 'Profile'},
      render: () => (
        <Tab.Pane>
          <Form>
            <div className="flex flex-row mb-5 items-center">
              <UserAvatar size="100px" user={user} />
              <div className="ml-5">
                <Header
                  size="large"
                  subheader={`@${info.name || user.data.id}`}
                  content={info.display_name}
                />
                <div className="text-gray-600">{info.bio}</div>
              </div>
            </div>
            <Form.Group widths="equal">
              <Form.Field
                name="display_name"
                control={Input}
                label="Display Name"
                placeholder="Display Name"
                value={info.display_name}
                onChange={handleChange}
              />
              <Form.Field
                name="name"
                control={Input}
                label="User Name"
                placeholder="User Name"
                value={info.name}
                onChange={handleChange}
              />
              <Form.Field
                name="gender"
                control={Select}
                options={GENDER_OPTIONS}
                label={{
                  children: 'Gender',
                  htmlFor: 'form-select-control-gender',
                }}
                placeholder="Gender"
                searchInput={{id: 'form-select-control-gender'}}
                value={info.gender}
                onChange={handleChange}
              />
              <Form.Field
                control={Select}
                name="ranking"
                options={RANK_OPTIONS}
                label={{
                  children: 'Ranking',
                  htmlFor: 'form-select-control-rank',
                }}
                placeholder="Ranking"
                search
                searchInput={{id: 'form-select-control-rank'}}
                value={info.ranking}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Field
              id="form-input-control-error-email"
              name="email"
              control={Input}
              label="Email"
              placeholder="example@ghost-go.com"
              // error={{
              //   content: "Please enter a valid email address",
              //   pointing: "below",
              // }}
              value={info.email}
              onChange={handleChange}
            />
            <Form.Field
              id="form-textarea-control-opinion"
              name="bio"
              control={TextArea}
              label="Bio"
              placeholder="Bio"
              value={info.bio}
              onChange={handleChange}
            />
            <Form.Field
              id="form-button-control-public"
              control={Button}
              color="blue"
              content="Update Profile"
              onClick={handleUpdateProfile}
            />
          </Form>
          <Divider section />
          <Form>
            <Form.Field
              id="form-input-control-current-password"
              name="password"
              control={Input}
              label="Current Password"
              type="password"
              value={pwd.password}
              onChange={handlePwdChange}
            />
            <Form.Field
              id="form-input-control-new-password"
              name="new_password"
              control={Input}
              label="New Password"
              type="password"
              value={pwd.new_password}
              onChange={handlePwdChange}
            />
            <Form.Field
              id="form-input-control-password-confirmation"
              name="new_password_confirmation"
              control={Input}
              label="Password Confirmation"
              type="password"
              value={pwd.new_password_confirmation}
              onChange={handlePwdChange}
            />
            <Form.Field
              id="form-button-control-public"
              control={Button}
              color="red"
              content="Update Password"
              onClick={handleUpdatePassword}
            />
          </Form>
        </Tab.Pane>
      ),
    },
    // {
    //   menuItem: {key: 'comments', content: 'Comments'},
    //   render: () => <Tab.Pane>Comments</Tab.Pane>,
    // },
    // {
    //   menuItem: (
    //     <Menu.Item key="messages">
    //       Messages<Label>15</Label>
    //     </Menu.Item>
    //   ),
    //   render: () => <Tab.Pane>Tab 2 Content</Tab.Pane>,
    // },
  ];

  useEffect(() => {
    if (!token) return;
    dispatch(fetchProfile({token}));
  }, [dispatch, token]);

  useUpdateEffect(() => {
    if (profile && profile.status === 'succeeded') {
      const attrs = profile.payload?.data.attributes || {};
      setInfo({
        ...attrs,
      });
    }
  }, [profile]);

  useUpdateEffect(() => {
    if (updatedUser && updatedUser.status === 'succeeded') {
      Toast.success('Your profile has been successfully updated.');
    }
  }, [updatedUser]);

  useUpdateEffect(() => {
    if (updatedPassword && updatedPassword.status === 'succeeded') {
      Toast.success('Your password has been successfully updated.');
    }
  }, [updatedPassword]);

  return (
    <Container>
      <Tab panes={panes} />
    </Container>
  );
};

export default Profile;
