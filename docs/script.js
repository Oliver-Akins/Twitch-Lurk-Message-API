const app = new Vue({
	el: `#app`,
	data() {return {
		authenticated: false,
		channels: [],
		channel: ``,
		login: {
			username: ``,
			password: ``,
		},
		api: null,
		messages: [],
		new_group: false,
		admin: false,
	}},
	methods: {
		async tryLogin() {
			try {
				let r = await axios.post(
					`/login`,
					undefined,
					{ auth: this.login }
				);
				this.api = axios.create({
					validateStatus: null,
					auth: this.login,
				});
				this.admin = r.data.admin;
				this.channels.push(...r.data.channels.sort());
				this.authenticated = true;
			} catch (_) {};
		},
		async getMessages() {
			if (!this.api) { return };
			let r = await this.api.get(`/manage/${this.channel}`);
			if (r.status === 200) {
				for (const m of r.data) {
					m.new = {
						lurk: ``,
						unlurk: ``,
					};
				};
				this.messages = r.data;
			} else {
				this.messages = [];
			};
		},
		async addLurk(group) {
			if (group.id === `new-group`) {
				group.lurk.push(group.new.lurk);
			} else {
				if (!this.api) { return };
				let payload = {
					lurk: [
						...group.lurk,
						group.new.lurk
					],
					unlurk: group.unlurk,
				};
				let r = await this.api.patch(
					`/manage/${this.channel}/message/${group.id}`,
					payload
				);
				if (r.status != 200) {
					alert(`Failed to update the group. Status: ${r.status}`);
				} else {
					group.lurk.push(group.new.lurk);
					alert(`Added lurk message successfully.`);
				};
			};
			group.new.lurk = ``;
		},
		async addUnlurk(group) {
			if (group.id === `new-group`) {
				group.unlurk.push(group.new.unlurk);
			} else {
				if (!this.api) { return };
				let payload = {
					lurk: group.lurk,
					unlurk: [
						...group.unlurk,
						group.new.unlurk
					],
				};
				let r = await this.api.patch(
					`/manage/${this.channel}/message/${group.id}`,
					payload
				);
				if (r.status != 200) {
					alert(`Failed to update the group. Status: ${r.status}`);
				} else {
					group.unlurk.push(group.new.unlurk);
					alert(`Added unlurk message successfully.`);
				};
			};
			group.new.unlurk = ``;
		},
		addGroup() {
			this.new_group = true;
			this.messages.unshift({
				lurk: [],
				unlurk: [],
				id: "new-group",
				new: {
					lurk: ``,
					unlurk: ``,
				},
			});
		},
		async saveGroup(group) {
			if (!this.api) { return };
			let r = await this.api.post(`/manage/${this.channel}/message`, {
				lurk: group.lurk,
				unlurk: group.unlurk,
			});
			if (r.status === 200) {
				this.messages.shift()
				this.messages.push({
					...r.data,
					new: {
						lurk: ``,
						unlurk: ``,
					},
				});
				alert(`Group has been saved`);
			};
			this.new_group = false;
		},
		async deleteGroup(group) {
			if (!this.api) { return };
			let r = await this.api.delete(`/manage/${this.channel}/message/${group.id}`);
			if (r.status === 200) {
				this.messages.splice(this.messages.indexOf(group, 1));
				alert(`Group has been deleted`);
			};
		},
		async deleteLurk(group, message) {
			if (group.id == "new-group") {
				group.lurk.splice(group.lurk.indexOf(message), 1);
			} else {
				if (!this.api) { return };
				let r = await this.api.patch(
					`/manage/${this.channel}/message/${group.id}`,
					{
						lurk: group.lurk.filter(m => m != message),
						unlurk: group.unlurk,
					}
				);
				if (r.status == 200) {
					group.lurk.splice(group.lurk.indexOf(message), 1);
					alert(`Deleted message successfully`);
				} else {
					alert(`Failed to delete the message. Status: ${r.status}`);
				};
			};
		},
		async deleteUnlurk(group, message) {
			if (group.id === `new-group`) {
				group.unlurk.splice(group.unlurk.indexOf(message), 1);
			} else {
				if (!this.api) { return };
				let r = await this.api.patch(
					`/manage/${this.channel}/message/${group.id}`,
					{
						lurk: group.lurk,
						unlurk: group.unlurk.filter(m => m != message),
					}
				);
				if (r.status == 200) {
					group.unlurk.splice(group.unlurk.indexOf(message), 1);
					alert(`Deleted message successfully`);
				} else {
					alert(`Failed to delete the message. Status: ${r.status}`);
				};
			};
		},
		removeNewGroup() {
			this.messages.shift();
			this.new_group = false;
		},
	},
});