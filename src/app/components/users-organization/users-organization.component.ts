import {Component, OnInit} from '@angular/core';
import {OrganizationService} from '../../services/organization.service';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../services/user.service';
import {Organization} from '../../model/Organization';
import {User} from '../../model/User';

@Component({
  selector: 'app-users-organization',
  templateUrl: './users-organization.component.html',
  styleUrls: ['./users-organization.component.scss']
})
export class UsersOrganizationComponent implements OnInit {

  organization: Organization;
  allUsers: User[];
  usersOrganization: User[];

  constructor(private organizationService: OrganizationService, private userService: UserService,
              private actRouter: ActivatedRoute) {
  }

  ngOnInit() {
    this.organizationService.findById(this.actRouter.snapshot.paramMap.get('id'))
      .subscribe(organization => {
        this.organization = organization;
        console.log(organization);
      });
    this.userService.getUsersByRoleId(4).subscribe(allUsers => {
      this.allUsers = allUsers;
    });
  }

  contain(user: User): boolean {
    if (this.organization && this.organization.responsiblePersons) {
      return this.organization.responsiblePersons.some((item) => item.id === user.id);
    }
  }

  check(e: any, user: User) {
    e.target.checked = !e.target.checked;
    if (!e.target.checked) {
      this.organizationService.addUserToOrganization(user.id, this.organization.id).subscribe(() => {
        this.organization.responsiblePersons.push(user);
        console.log('User: #' + user.id + ' add to organization: #' + this.organization.id);
        e.target.checked = !e.target.checked;
      });
    } else {
      this.organizationService.removeUserFromOrganization(user.id, this.organization.id).subscribe(() => {
        this.organization.responsiblePersons.filter(item => item.id !== user.id);
        console.log('User: #' + user.id + ' remove from organization: #' + this.organization.id);
        e.target.checked = !e.target.checked;
      });
    }
  }
}


