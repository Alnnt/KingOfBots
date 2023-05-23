import $ from 'jquery'
import { re } from "@babel/core/lib/vendor/import-meta-resolve";

export default {
    state: {
        id: "",
        username: "",
        photo: "",
        token: "",
        is_login: false,
    },
    getters: {
    },
    mutations: {
        updateUser(state, user) {
            state.id = user.id;
            state.username = user.username;
            state.photo = user.photo;
            state.is_login = user.is_login;
        },
        updateToken(state, token) {
            state.token = token;
        }
    },
    actions: {
        login(context, data) {
            $.ajax({
                url: "http://localhost:8090/user/account/token",
                type: "post",
                data: {
                    username: data.username,
                    password: data.password
                },
                success(resp) {
                    if (resp.error_message === "success") {
                        context.commit("updateToken", resp.token)
                        data.success(resp)
                    } else {
                        data.error(resp);
                    }
                },
                error(resp) {
                    data.error(resp);
                }
            })
        },
        getInfo(context, data) {
            $.ajax({
                url: "http://localhost:8090/user/account/info",
                type: "get",
                headers: {
                    Authorization: "Bearer " + context.state.token
                },
                success(resp) {
                    context.commit("updateUser",{
                        ...resp,
                        is_login: true
                    });
                    data.success(resp);
                },
                error(resp) {
                    data.error(resp);
                }

            })
        }
    },
    modules: {
    }
}