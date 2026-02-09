use anchor_lang::prelude::*;
use anchor_spl::{
    token_2022::{self, MintTo},
    token_interface::{Mint, TokenAccount, TokenInterface},
};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod pod_program {
    use super::*;

    // Initialize a new vehicle (Mint specific logical NFT)
    // In a real app, this might mint a Token-2022 with NonTransferable extension
    pub fn initialize_vehicle(ctx: Context<InitializeVehicle>, vehicle_id: String) -> Result<()> {
        msg!("Initializing Vehicle: {}", vehicle_id);
        
        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        token_2022::mint_to(cpi_ctx, 1)?;
        
        // Initialize the driving record PDA
        let driving_record = &mut ctx.accounts.driving_record;
        driving_record.vehicle_mint = ctx.accounts.mint.key();
        driving_record.owner = ctx.accounts.authority.key();
        driving_record.total_distance = 0;
        driving_record.trip_count = 0;
        
        Ok(())
    }

    pub fn record_drive(ctx: Context<RecordDrive>, distance: u64) -> Result<()> {
        let driving_record = &mut ctx.accounts.driving_record;
        driving_record.total_distance += distance;
        driving_record.trip_count += 1;
        
        msg!("Recorded drive: {} km. Total: {}", distance, driving_record.total_distance);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeVehicle<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    // The mint account of the vehicle token
    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,
    
    // The user's token account for the vehicle
    #[account(mut)]
    pub token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32 + 8 + 8,
        seeds = [b"driving_record", mint.key().as_ref()],
        bump
    )]
    pub driving_record: Account<'info, DrivingRecord>,
    
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct RecordDrive<'info> {
    pub authority: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"driving_record", vehicle_mint.key().as_ref()],
        bump,
        has_one = owner, // Ensure the signer is the owner
        constraint = driving_record.owner == authority.key()
    )]
    pub driving_record: Account<'info, DrivingRecord>,
    
    pub vehicle_mint: InterfaceAccount<'info, Mint>,
    
    /// CHECK: We only use this to verify ownership if needed, but has_one=owner on driving_record logic covers it.
    /// In a more advanced version, we'd verify the user holds the token.
    pub owner: UncheckedAccount<'info>,
}

#[account]
pub struct DrivingRecord {
    pub vehicle_mint: Pubkey,
    pub owner: Pubkey,
    pub total_distance: u64,
    pub trip_count: u64,
}
